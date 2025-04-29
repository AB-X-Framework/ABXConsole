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
        private final String service;
        private final String username;

        private final String permission;

        public ReqHolder(String service, String permission, String username) {
            this.service = service;
            this.permission = permission;
            this.username = username;
        }

        private String token() throws Exception {
            return JWTUtils.generateToken(username, privateKey, 60,
                    List.of(permission));
        }

        public ServiceRequest delete(String url) throws Exception {
            return servicesClient.delete(service, url).jwt(token());
        }

        public ServiceRequest patch(String url) throws Exception {
            return servicesClient.patch(service, url).jwt(token());
        }

        public ServiceRequest post(String url) throws Exception {
            return servicesClient.post(service, url).jwt(token());
        }

        public ServiceRequest get(String url) throws Exception {
            return servicesClient.get(service, url).jwt(token());
        }
    }

    @Value("${jwt.private}")
    protected String privateKey;

    @Autowired
    protected ServicesClient servicesClient;

    public ReqHolder persistence(HttpServletRequest request) throws Exception {
        String username = request.getUserPrincipal().getName();
        return new ReqHolder("persistence", "Persistence", username);
    }

    public ReqHolder repository(HttpServletRequest request) throws Exception {
        String username = request.getUserPrincipal().getName();
        return new ReqHolder("repository", "Repository", username);
    }
}
