package org.abx.console.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.abx.console.spring.CustomErrorController;
import org.abx.jwt.JWTUtils;
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
        } catch (Exception e) {
            return CustomErrorController.error("Cannot collect user projects.");
        }
    }


    @PostMapping(value = "/projects", produces = MediaType.APPLICATION_JSON_VALUE)
    @Secured("UseABX")
    public String createProject(HttpServletRequest request,
                                @RequestParam String projectData) throws Exception {
        String username = request.getUserPrincipal().getName();

        String token = JWTUtils.generateToken(username, privateKey, 60,
                List.of("Persistence", "Repository"));
        JSONObject jsonData = new JSONObject(projectData);
        JSONArray repositories = jsonData.getJSONArray("repos");
        for (int i = 0; i < repositories.length(); ++i) {
            JSONObject jsonRepoData = repositories.getJSONObject(i);
            boolean valid = servicesClient.post("repository",
                            "/repository/validate").jwt(token).
                    addPart("url", jsonRepoData.getString("url")).
                    addPart("branch", jsonRepoData.getString("branch")).
                    addPart("engine", jsonRepoData.getString("engine")).
                    addPart("creds", jsonRepoData.getJSONObject("creds").toString()).
                    process().asBoolean();
            if (!valid) {
                JSONObject error = CustomErrorController.error("Invalid project");
                error.put("type", "repos");
                JSONArray errors = new JSONArray();
                JSONObject jsonRepo = new JSONObject();
                errors.put(jsonRepo);
                jsonRepo.put("id", jsonRepoData.getInt("id"));
                jsonRepo.put("error", "Invalid credentials");
                error.put("repos", errors);
                return error.toString();
            }
        }

        JSONObject result = new JSONObject();
        try {
            return result.put("id", servicesClient.post("persistence",
                    "/persistence/projects").jwt(token).addPart("projectData", projectData).process().asLong()).toString();
        } catch (Exception e) {
            return CustomErrorController.errorString("Cannot create " + new JSONObject(projectData).getString("name") + " project." + e.getMessage());
        }
    }


    @Secured("Persistence")
    @GetMapping(value = "/projects/{projectId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public String getProject(HttpServletRequest request,
                             @PathVariable long projectId) throws Exception {
        String username = request.getUserPrincipal().getName();
        String token = JWTUtils.generateToken(username, privateKey, 60,
                List.of("Persistence"));
        try {
            return servicesClient.get("persistence",
                    "/persistence/projects/" + projectId).jwt(token).process().asString();
        } catch (Exception e) {
            return CustomErrorController.errorString("Cannot get dashboard data for project " + projectId);
        }
    }

    @Secured("Persistence")
    @DeleteMapping(value = "/projects/{projectId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public String deleteProject(HttpServletRequest request,
                                @PathVariable long projectId) throws Exception {
        String username = request.getUserPrincipal().getName();
        String token = JWTUtils.generateToken(username, privateKey, 60,
                List.of("Persistence"));
        JSONObject result = new JSONObject();
        try {
            boolean success = servicesClient.delete("persistence",
                    "/persistence/projects/" + projectId).jwt(token).process().asBoolean();
            result.put("success", success);
            return result.toString();
        } catch (Exception e) {
            return CustomErrorController.errorString("Cannot get project data for " + projectId);
        }
    }

    @Secured("Persistence")
    @PutMapping(value = "/projects/{projectId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public String updateProject(HttpServletRequest request,
                                @PathVariable long projectId,
                                @RequestParam String projectData) throws Exception {
        String username = request.getUserPrincipal().getName();
        String token = JWTUtils.generateToken(username, privateKey, 60,
                List.of("Persistence"));
        JSONObject result = new JSONObject();
        try {
            boolean success = servicesClient.put("persistence",
                            "/persistence/projects/" + projectId).addPart("projectData", projectData).
                    jwt(token).process().asBoolean();
            result.put("success", success);
            return result.toString();
        } catch (Exception e) {
            return CustomErrorController.errorString("Cannot get project data for " + projectId);
        }
    }
}
