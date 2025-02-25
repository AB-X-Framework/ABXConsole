package org.abx.console.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.abx.console.spring.CustomErrorController;
import org.abx.jwt.JWTUtils;
import org.abx.services.ServicesClient;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rest")
public class ProjectsController {

    @Value("${jwt.private}")
    private String privateKey;

    @Autowired
    ServicesClient servicesClient;

    @GetMapping(value = "/projects", produces = MediaType.APPLICATION_JSON_VALUE)
    @Secured("UseABX")
    public String projects(final HttpServletRequest request) throws Exception {
        return getProjects(request.getUserPrincipal().getName()).toString();
    }

    protected JSONObject getProjects(String username) throws Exception {
        String token = JWTUtils.generateToken(username, privateKey, 60,
                List.of("Persistence"));
        JSONObject result = new JSONObject();
        try {
            return result.put("projects", servicesClient.get("persistence",
                    "/persistence/projects").jwt(token).process().asJSONArray());
        }catch (Exception e){
            return CustomErrorController.error("Cannot collect user projects.");
        }
    }


    @PostMapping(value = "/projects", produces = MediaType.APPLICATION_JSON_VALUE)
    @Secured("UseABX")
    public String createProject(HttpServletRequest request,
                                  @RequestParam String name) throws Exception {
        String username = request.getUserPrincipal().getName();
        String token = JWTUtils.generateToken(username, privateKey, 60,
                List.of("Persistence"));
        JSONObject result = new JSONObject();
        try {
            return result.put("id", servicesClient.post("persistence",
                    "/persistence/projects").jwt(token).addPart("projectName",name).process().asLong()).toString();
        }catch (Exception e){
            return CustomErrorController.errorString("Cannot create "+name+" project."+e.getMessage());
        }
    }
}
