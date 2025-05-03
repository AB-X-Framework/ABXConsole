package org.abx.console.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.abx.jwt.JWTUtils;
import org.abx.spring.ErrorMessage;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.http.MediaType;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rest")
public class ProjectsController extends ServicesClientController {
    private final static String Project = "Project-";


    /**
     * Creates a new project
     * @param request The full HTTP request
     * @param projectData The Project Data in JSON with repos
     * @return A JSON Object with error true is failure and the message, otherwise, project id in id
     */
    @PostMapping(value = "/projects", produces = MediaType.APPLICATION_JSON_VALUE)
    @Secured("UseABX")
    public String createProject(HttpServletRequest request,
                                @RequestParam String projectData) {
        try {
            //First verify repos
            String username = request.getUserPrincipal().getName();
            String token = JWTUtils.generateToken(username, privateKey, 60,
                    List.of("Repository", "Persistence"));
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
            projectId = servicesClient.post("persistence",
                    "/persistence/projects").jwt(token).addPart("projectData", projectData).process().asLong();

            token = JWTUtils.generateToken(Project + projectId, privateKey, 60,
                    List.of("Repository"));
            //Add repos
            for (int i = 0; i < repositories.length(); ++i) {
                JSONObject jsonRepoData = repositories.getJSONObject(i);
                addNewRepository(jsonRepoData, token);
            }

            JSONObject result = new JSONObject();
            return result.put("id", projectId).toString();
        } catch (Exception e) {
            return ErrorMessage.errorString("Cannot create " + new JSONObject(projectData).getString("name") + " project." + e.getMessage());
        }
    }

    /**
     * Adds new repository creds to repository microservice
     * @param jsonRepoData The Repo data in JSON
     * @param token The Auth token
     * @throws Exception if repo couldn't be created
     */
    private void addNewRepository(JSONObject jsonRepoData, String token) throws Exception {
        servicesClient.post("repository",
                        "/repository/update/" + jsonRepoData.getString("repoName")).jwt(token).
                addPart("url", jsonRepoData.getString("url")).
                addPart("branch", jsonRepoData.getString("branch")).
                addPart("engine", jsonRepoData.getString("engine")).
                addPart("creds", jsonRepoData.getString("creds")).
                process().asBoolean();
    }

    @Secured("Persistence")
    @GetMapping(value = "/projects/{projectId}/repos", produces = MediaType.APPLICATION_JSON_VALUE)
    public String getProjectRepos(HttpServletRequest request,
                             @PathVariable long projectId) {
        try {
            JSONObject repository = persistence(request).get(
                    "/persistence/projects/" + projectId+"/repos").process().asJSONObject();
            JSONArray repos = repository.getJSONArray("repos");
            String projectName = Project + projectId;
            String token = JWTUtils.generateToken(projectName, privateKey, 60,
                    List.of("Repository"));
            JSONObject status = servicesClient.get("repository",
                    "/repository/status").jwt(token).process().asJSONObject();
            for (int i = 0; i < repos.length(); ++i) {
                JSONObject repo = repos.getJSONObject(i);
                String repoName = repo.getString("repoName");
                if (status.isNull(repoName)){
                    String repoToken = JWTUtils.generateToken(Project + projectId, privateKey, 60,
                            List.of("Repository"));
                    addNewRepository(repo, repoToken);
                    repo.put("status","Loading");
                }else {
                    JSONObject singleRepoStatus = status.getJSONObject(repo.getString("repoName"));
                    repo.put("status", singleRepoStatus.getString("status"));
                }
            }
            return repository.toString();
        } catch (Exception e) {
            return ErrorMessage.errorString("Cannot get repos for project " + projectId + ". " + e.getMessage());
        }
    }


    /**
     * First validate user can add repositories, then create a repository live
     *
     * @param request The full HTTP request
     * @param projectId The project Id
     * @param repoData The repo data in json
     * @return A json object if error:true if it cannot be added
     */
    @Secured("Persistence")
    @PostMapping(value = "/projects/{projectId}/repos", produces = MediaType.APPLICATION_JSON_VALUE)
    public String addRepo(HttpServletRequest request,
                          @PathVariable long projectId,
                          @RequestParam String repoData) {
        try {
            JSONObject jsonRepoData = new JSONObject(repoData);
            String repoName = jsonRepoData.getString("repoName");
            JSONObject addedStatus = persistence(request).post("/persistence/projects/" + projectId + "/repos").
                    addPart("repoName", repoName).
                    addPart("engine", jsonRepoData.getString("engine")).
                    addPart("url", jsonRepoData.getString("url")).
                    addPart("branch", jsonRepoData.getString("branch")).
                    addPart("creds", jsonRepoData.getString("creds")).
                    process().asJSONObject();
            if (addedStatus.getBoolean("error") ) {
                return addedStatus.toString();
            }
            String token = JWTUtils.generateToken(Project + projectId, privateKey, 60,
                    List.of("Repository"));
            addNewRepository(jsonRepoData, token);
            return servicesClient.get("repository",
                    "/repository/status/" + repoName).jwt(token).process().asString();
        } catch (Exception e) {
            return ErrorMessage.errorString("Cannot create repo  on project " + projectId + ". " + e.getMessage());
        }
    }


    /**
     * First validate user can add repositories, then create a repository live
     *
     * @param request The full HTTP request
     * @param projectId The project Id
     * @param repoData The repo data in json
     * @return A json object if error:true if it cannot be added
     */
    @Secured("Persistence")
    @PatchMapping(value = "/projects/{projectId}/repos/{repoName}", produces = MediaType.APPLICATION_JSON_VALUE)
    public String updateRepo(HttpServletRequest request,
                             @PathVariable long projectId,
                             @PathVariable String repoName,
                             @RequestParam String repoData) {
        try {
            JSONObject jsonRepoData = new JSONObject(repoData);
            String newName = jsonRepoData.getString("newName");
            JSONObject addedStatus = persistence(request).patch("/persistence/projects/" + projectId + "/repos/"+repoName).
                    addPart("newName", newName).
                    addPart("engine", jsonRepoData.getString("engine")).
                    addPart("url", jsonRepoData.getString("url")).
                    addPart("branch", jsonRepoData.getString("branch")).
                    addPart("creds", jsonRepoData.getString("creds")).
                    process().asJSONObject();
            if (addedStatus.getBoolean("error")) {
                return addedStatus.toString();
            }
            String token = JWTUtils.generateToken(Project + projectId, privateKey, 60,
                    List.of("Repository"));
            if (!repoName.equals(newName)) {
                servicesClient.delete("persistence",
                        "/persistence/projects/" + projectId + "/repos/" + repoName).jwt(token).process().asString();
            }
            jsonRepoData.remove("newName");
            jsonRepoData.put("repoName", newName);
            addNewRepository(jsonRepoData, token);
            return servicesClient.get("repository",
                    "/repository/status/" + newName ).jwt(token).process().asString();
        } catch (Exception e) {
            return ErrorMessage.errorString("Cannot create repo  on project " + projectId + ". " + e.getMessage());
        }
    }

    /**
     * Deletes a repo from a project
     * @param request The full HTTP request
     * @param projectId The project Id
     * @param repoName The repo which will be deleted
     * @return A JSON object with error if there is a failure
     */
    @Secured("Persistence")
    @DeleteMapping(value = "/projects/{projectId}/repos/{repoName}", produces = MediaType.APPLICATION_JSON_VALUE)
    public String deleteRepo(HttpServletRequest request,
                             @PathVariable long projectId,
                             @PathVariable String repoName) {
        try {
            String deletedString = persistence(request).delete(
                    "/persistence/projects/" + projectId + "/repos/" + repoName).process().asString();
            boolean deleted = Boolean.parseBoolean(deletedString);
            if (!deleted) {
                return ErrorMessage.errorString("Cannot delete repository.");
            }
            String projectName = Project + projectId;
            String token = JWTUtils.generateToken(projectName, privateKey, 60,
                    List.of("Repository"));
            return servicesClient.delete("repository",
                    "/repository/remove/" + repoName).jwt(token).process().asString();
        } catch (Exception e) {
            return ErrorMessage.errorString("Cannot delete repo " + repoName + " on project " + projectId + ". " + e.getMessage());
        }
    }


    /**
     * Deletes whole project
     * @param request The full HTTP request
     * @param projectId The project id to be deleted
     * @return A JSON object with error if there is a failure
     */
    @Secured("Persistence")
    @DeleteMapping(value = "/projects/{projectId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public String deleteProject(HttpServletRequest request,
                                @PathVariable long projectId) {
        try {
            String username = request.getUserPrincipal().getName();
            String token = JWTUtils.generateToken(username, privateKey, 60,
                    List.of("Repository", "Persistence"));
            JSONObject repository = servicesClient.get("persistence",
                    "/persistence/projects/" + projectId).jwt(token).process().asJSONObject();
            JSONArray repos = repository.getJSONArray("repos");
            for (int i = 0; i < repos.length(); ++i) {
                JSONObject repo = repos.getJSONObject(i);
                servicesClient.delete("repository",
                        "/repository/remove/" + repo.getString("repoName")).jwt(token).process().asString();
            }


            String result = servicesClient.delete("persistence",
                    "/persistence/projects/" + projectId).jwt(token).process().asString();
            boolean deleted = Boolean.parseBoolean(result);
            if (!deleted) {
                return ErrorMessage.errorString("Cannot delete project.");
            }
            return result;
        } catch (Exception e) {
            return ErrorMessage.errorString("Cannot delete project " + projectId + ". " + e.getMessage());
        }
    }

}
