package org.abx.console.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dashboards")
public class DashboardsController {

    @RequestMapping(value = "/dashboards", produces = "application/json")
    @Secured("UseABX")
    public String dashboards(final HttpServletRequest request) {
        return getDashboards(request.getUserPrincipal().getName()).toString();
    }

    protected JSONArray getDashboards(String user) {
        JSONArray jsonDashboards = new JSONArray();
        JSONObject jsonDashboard = new JSONObject();
        jsonDashboards.put(jsonDashboard);
        jsonDashboard.put("id", 1);
        jsonDashboard.put("name", "Beauty dashboard");
        return jsonDashboards;
    }
}
