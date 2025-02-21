package org.abx.console.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/projects")
public class ProjectsController {

    @GetMapping(value = "/projects", produces = "application/json")
    @Secured("UseABX")
    public String projects(final HttpServletRequest request) {
        return getProjects(request.getUserPrincipal().getName()).toString();
    }

    protected JSONArray getProjects(String user){
        JSONArray jsonExecutions = new JSONArray();
        JSONObject jsonExecution = new JSONObject();
        jsonExecutions.put(jsonExecution);
        jsonExecution.put("id", 1);
        jsonExecution.put("name", "Great Project");
        return jsonExecutions;

    }
}
