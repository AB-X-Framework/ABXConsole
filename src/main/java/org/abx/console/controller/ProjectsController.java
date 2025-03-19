package org.abx.console.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.abx.jwt.JWTUtils;
import org.abx.services.ServicesClient;
import org.abx.spring.ErrorMessage;
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

    @PostMapping(value = "/projects", produces = MediaType.APPLICATION_JSON_VALUE)
    @Secured("UseABX")
    public String createProject(HttpServletRequest request,
                                @RequestParam String projectData) throws Exception {
        //First verify repos
        String username = request.getUserPrincipal().getName();
        String token = JWTUtils.generateToken(username, privateKey, 60,
                List.of("Repository","Persistence"));
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
                JSONObject error = ErrorMessage.error("Invalid project");
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
        //Add project
        long projectId;
        try {
            projectId = servicesClient.post("persistence",
                    "/persistence/projects").jwt(token).addPart("projectData", projectData).process().asLong();
        } catch (Exception e) {
            return ErrorMessage.errorString("Cannot create " + new JSONObject(projectData).getString("name") + " project." + e.getMessage());
        }
        token = JWTUtils.generateToken("Project-" + projectId, privateKey, 60,
                List.of("Repository"));
        //Add repos
        for (int i = 0; i < repositories.length(); ++i) {
            JSONObject jsonRepoData = repositories.getJSONObject(i);
            servicesClient.post("repository",
                            "/repository/update").jwt(token).
                    addPart("url", jsonRepoData.getString("url")).
                    addPart("name", jsonRepoData.getString("name")).
                    addPart("branch", jsonRepoData.getString("branch")).
                    addPart("engine", jsonRepoData.getString("engine")).
                    addPart("creds", jsonRepoData.getString("creds")).
                    process().asBoolean();
        }

        JSONObject result = new JSONObject();
        return result.put("id", projectId).toString();

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
                    "/persistence/projects/" + projectId + "/repos/" + repoId).jwt(token).process().asBoolean();
            result.put("success", success);
            return result.toString();
        } catch (Exception e) {
            return ErrorMessage.errorString("Cannot get project data for " + projectId);
        }
    }
}
