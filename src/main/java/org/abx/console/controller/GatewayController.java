package org.abx.console.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.abx.console.spring.CustomErrorController;
import org.abx.jwt.JWTUtils;
import org.abx.services.ServiceRequest;
import org.abx.services.ServiceResponse;
import org.abx.services.ServicesClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping(value = "/gateway")
public class GatewayController {

    @Value("${jwt.private}")
    private String privateKey;

    @Autowired
    ServicesClient servicesClient;

    private final int init = "/gateway/".length();

    @PreAuthorize("permitAll()")
    @RequestMapping("/ping")
    public String ping(HttpServletRequest request) throws Exception{
        String data= new String(cacheRequestBody(request));
        return data;
    }

    private byte[] getRequestBody(HttpServletRequest request) throws IOException {
        try (InputStream inputStream = request.getInputStream();
             ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            byte[] buffer = new byte[1024];
            int bytesRead;
            while ((bytesRead = inputStream.read(buffer)) != -1) {
                outputStream.write(buffer, 0, bytesRead);
            }
            return outputStream.toByteArray();
        }
    }
    private byte[] cacheRequestBody(HttpServletRequest request) throws IOException {
        InputStream inputStream = request.getInputStream();
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        byte[] buffer = new byte[1024];
        int bytesRead;
        while ((bytesRead = inputStream.read(buffer)) != -1) {
            outputStream.write(buffer, 0, bytesRead);
        }
        return outputStream.toByteArray();
    }


    @RequestMapping(value = "/**")
    @PreAuthorize("permitAll()")
    public ResponseEntity<byte[]> gateway(HttpServletRequest request) throws Exception {
        byte[] data = getRequestBody(request);
        HttpHeaders headers = new HttpHeaders();
        if (request.getUserPrincipal() == null) {
            headers.add(HttpHeaders.CONTENT_TYPE, "application/json"); // Change as needed
            return new ResponseEntity<>(
                    CustomErrorController.errorString("Please log in").getBytes(),
                    headers,
                    HttpStatus.UNAUTHORIZED);
        }
        String username = request.getUserPrincipal().getName();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        List<String> authorities = authentication.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());
        String url = request.getRequestURI().substring(init);


        int serviceDelim = url.indexOf("/");
        String serviceName = url.substring(0, serviceDelim);
        String serviceReq = url.substring(serviceDelim);
        String queryString = request.getQueryString();
        if (queryString != null) {
            serviceReq += "?" + queryString;
        }
        String token = JWTUtils.generateToken(username, privateKey, 60,
                authorities);


        try {
            ServiceRequest req = servicesClient.withJWT(token).
                    create(request.getMethod(), serviceName, serviceReq);
            switch (request.getMethod()) {
                case "POST":
                case "PUT":
                case "PATCH":
                    String out=new String(data);
                    req.setBody(data);
            }
            if (request.getHeader(HttpHeaders.CONTENT_TYPE)!=null){
                req.addHeader(HttpHeaders.CONTENT_TYPE,request.getHeader(HttpHeaders.CONTENT_TYPE));
            }
            ServiceResponse res = req.process();
            List<String> contentType = res.headers().get(HttpHeaders.CONTENT_TYPE);
            if (contentType != null) {
                for (String value : contentType) {
                    headers.add(HttpHeaders.CONTENT_TYPE, value);
                }
            }
            // Set custom content type (e.g., PDF, JSON, or any other MIME type)
            return new ResponseEntity<>(res.asByteArray(), headers, HttpStatus.resolve(res.statusCode()));
        } catch (Exception e) {
            return new ResponseEntity<>(
                    CustomErrorController.errorString(e.getMessage()).getBytes(),
                    headers,
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }
}
