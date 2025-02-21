package org.abx.console.spring;

import org.abx.services.ServicesClient;
import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

@Component
public class ServiceClient {
    @Value("${jwt.private}")
    private String privateKey;

    private final ServicesClient servicesClient;

    public ServiceClient() {
        servicesClient = new ServicesClient();
    }

    public ServicesClient client() {
        return servicesClient;
    }

    public String
}
