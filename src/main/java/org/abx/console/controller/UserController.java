package org.abx.console.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private DashboardsController dashboardController;
    @Autowired
    private ExecutionsController executionsController;
    @Autowired
    private ProjectsController projectsController;

    @RequestMapping(value = "/menu", produces = "application/json")
    @Secured({"Dashboard","Execution"})
    public String menu(final HttpServletRequest request) {
        JSONObject jsonMenu = new JSONObject();
        jsonMenu.put("dashboards",dashboardController.dashboards(request));
        jsonMenu.put("execs",executionsController.executions(request));
        jsonMenu.put("execs",projectsController.projects(request));
        return jsonMenu.toString();
    }
}
