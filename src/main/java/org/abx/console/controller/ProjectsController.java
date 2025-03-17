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
                    addPart("creds", jsonRepoData.getString("creds")).
                    process().asBoolean();
            if (!valid) {
                JSONObject error = CustomErrorController.error("Invalid project");
                error.put("type", "repos");
                JSONArray errors = new JSONArray();
                JSONObject jsonRepo = new JSONObject();
                errors.put(jsonRepo);
                jsonRepo.put("id", jsonRepoData.getInt("id"));
                jsonRepo.put("error", "Repository credentials are invalid.");
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
    @DeleteMapping(value = "/projects/{projectId}/repos/{repoId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public String deleteRepository(HttpServletRequest request,
                                @PathVariable long projectId,
                                   @PathVariable long repoId) throws Exception {
        String username = request.getUserPrincipal().getName();
        String token = JWTUtils.generateToken(username, privateKey, 60,
                List.of("Persistence"));
        JSONObject result = new JSONObject();
        try {
            boolean success = servicesClient.delete("persistence",
                    "/persistence/projects/" + projectId+"/repos/"+repoId).jwt(token).process().asBoolean();
            result.put("success", success);
            return result.toString();
        } catch (Exception e) {
            return CustomErrorController.errorString("Cannot get project data for " + projectId);
        }
    }
}
