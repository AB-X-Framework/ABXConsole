package org.abx.console.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/execs")
public class ExecutionsController {

    @GetMapping(value = "/execs", produces = "application/json")
    @Secured("UseABX")
    public String executions(final HttpServletRequest request) {
        return getExecutions(request.getUserPrincipal().getName()).toString();
    }

    protected JSONArray getExecutions(String user) {
        JSONArray jsonExecutions = new JSONArray();
        JSONObject jsonExecution = new JSONObject();
        jsonExecutions.put(jsonExecution);
        jsonExecution.put("id", 1);
        jsonExecution.put("name", "Working session");
        return jsonExecutions;

    }
}
