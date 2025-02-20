package org.abx.console.controller;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dashboards")
public class DashboardController {

    @RequestMapping(value = "/dashboards", produces = "application/json")
    @Secured("Dashboard")
    public String dashboards() {
        JSONArray jsonDashboards = new JSONArray();
        JSONObject jsonDashboard = new JSONObject();
        jsonDashboards.put(jsonDashboard);
        jsonDashboard.put("id", 1);
        jsonDashboard.put("name", "hello");
        return jsonDashboards.toString();
    }
}
