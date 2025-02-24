package org.abx.console.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.abx.console.spring.CustomErrorController;
import org.abx.jwt.JWTUtils;
import org.abx.services.ServiceRequest;
import org.abx.services.ServicesClient;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/dashboards")
public class DashboardsController {

    @Value("${jwt.private}")
    private String privateKey;

    @Autowired
    ServicesClient servicesClient;

    @GetMapping(value = "/dashboards", produces = MediaType.APPLICATION_JSON_VALUE)
    @Secured("UseABX")
    public String dashboards(final HttpServletRequest request) throws Exception {
        return getDashboards(request.getUserPrincipal().getName()).toString();
    }

    @PostMapping(value = "/dashboards", produces = MediaType.APPLICATION_JSON_VALUE)
    @Secured("UseABX")
    public String createDashboard(HttpServletRequest request,
                                @RequestParam String name) throws Exception {
        String username = request.getUserPrincipal().getName();
        String token = JWTUtils.generateToken(username, privateKey, 60,
                List.of("Persistence"));
        JSONObject result = new JSONObject();
        try {
            return result.put("id", servicesClient.post("persistence",
                    "/persistence/dashboards").jwt(token).addPart("name",name).process().asLong()).toString();
        }catch (Exception e){
            return CustomErrorController.errorString("Cannot create "+name+" dashboard."+e.getMessage());
        }
    }

    protected JSONObject getDashboards(String username) throws Exception {
        String token = JWTUtils.generateToken(username, privateKey, 60,
                List.of("Persistence"));
        JSONObject result = new JSONObject();
        try {
            return result.put("dashboards", servicesClient.get("persistence",
                    "/persistence/dashboards").jwt(token).process().asJSONArray());
        }catch (Exception e){
            return CustomErrorController.error("Cannot collect user dashboards.");
        }
    }
}
