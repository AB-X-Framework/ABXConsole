package org.abx.console.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.abx.console.spring.CustomErrorController;
import org.abx.jwt.JWTUtils;
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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    @RequestMapping(value = "/**")
    @PreAuthorize("permitAll()")
    public ResponseEntity<byte[]> gateway(final HttpServletRequest request) throws Exception{
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
        String serviceReq = url.substring(serviceDelim );
        String queryString = request.getQueryString();
        if (queryString != null) {
            serviceReq += "?" + queryString;
        }
        String token = JWTUtils.generateToken(username, privateKey, 60,
                authorities);

        try {
            ServiceResponse sr = servicesClient.withJWT(token).
                    create(request.getMethod(), serviceName, serviceReq).process();
            List<String> contentType = sr.headers().get(HttpHeaders.CONTENT_TYPE);
            if (contentType != null) {
                for (String value : contentType) {
                    headers.add(HttpHeaders.CONTENT_TYPE, value);
                }
            }
            // Set custom content type (e.g., PDF, JSON, or any other MIME type)
            return new ResponseEntity<>(sr.asByteArray(), headers, HttpStatus.resolve(sr.statusCode()));
        } catch (Exception e) {
            return new ResponseEntity<>(
                    CustomErrorController.errorString(e.getMessage()).getBytes(),
                    headers,
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }
}
