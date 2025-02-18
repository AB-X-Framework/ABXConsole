package org.abx.console.controller;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;

public class DashboardController {

    @GetMapping(value = "/dashboards", produces = "application/json")
    @PreAuthorize("dashboard")
    public String login() {
        JSONArray jsonDashboards = new JSONArray();
        JSONObject jsonDashboard = new JSONObject();
        jsonDashboards.put(jsonDashboard);
        jsonDashboard.put("id", 1);
        jsonDashboard.put("name", "hello");
        return jsonDashboards.toString();
    }
}
