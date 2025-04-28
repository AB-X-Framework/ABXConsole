package org.abx.console.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.abx.jwt.JWTUtils;
import org.abx.services.ServiceRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.abx.services.ServicesClient;

import java.util.List;

public abstract class ServicesClientController {

    public class ReqHolder {
        private String service;
        private String username;

        public ReqHolder(String service, String username) {
            this.service = service;
            this.username = username;
        }

        public ServiceRequest delete(String url) throws Exception {
            String token = JWTUtils.generateToken(username, privateKey, 60,
                    List.of(service));
            return servicesClient.delete(service, url).jwt(token);
        }

        public ServiceRequest post(String url) throws Exception {
            String token = JWTUtils.generateToken(username, privateKey, 60,
                    List.of(service));
            return servicesClient.post(service, url).jwt(token);
        }

        public ServiceRequest get(String url) throws Exception {
            String token = JWTUtils.generateToken(username, privateKey, 60,
                    List.of(service));
            return servicesClient.get(service, url).jwt(token);
        }
    }

    @Value("${jwt.private}")
    protected String privateKey;

    @Autowired
    protected ServicesClient servicesClient;

    public ReqHolder persistence(HttpServletRequest request) throws Exception {
        String username = request.getUserPrincipal().getName();
        return new ReqHolder("Persistence", username);
    }

    public ReqHolder repository(HttpServletRequest request) throws Exception {
        String username = request.getUserPrincipal().getName();
        return new ReqHolder("Repository", username);
    }
}
