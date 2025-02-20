package org.abx.console.controller;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/execs")
public class ExecutionsController {

    @GetMapping(value = "/execs", produces = "application/json")
    @PreAuthorize("Dashboard")
    public String executions() {
        JSONArray jsonExecutions = new JSONArray();
        JSONObject jsonExecution = new JSONObject();
        jsonExecutions.put(jsonExecution);
        jsonExecution.put("id", 1);
        jsonExecution.put("name", "hello");
        return jsonExecutions.toString();
    }
}
