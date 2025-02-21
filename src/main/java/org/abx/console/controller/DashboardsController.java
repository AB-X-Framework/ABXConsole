package org.abx.console.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.abx.jwt.JWTUtils;
import org.abx.services.ServiceRequest;
import org.abx.services.ServicesClient;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/dashboards")
public class DashboardsController {

    @Value("${jwt.private}")
    private String privateKey;

    @Autowired
    ServicesClient servicesClient;

    @RequestMapping(value = "/dashboards", produces = MediaType.APPLICATION_JSON_VALUE)
    @Secured("UseABX")
    public String dashboards(final HttpServletRequest request) throws Exception {
        return getDashboards(request.getUserPrincipal().getName()).toString();
    }

    protected JSONArray getDashboards(String username) throws Exception {
        String token = JWTUtils.generateToken(username, privateKey, 60,
                List.of("Persistence"));
        return servicesClient.get("persistence", "/persistence/dashboards").jwt(token).process().asJSONArray();
    }
}
