package org.abx.console.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
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

    @RequestMapping(value = "/menu", produces = MediaType.APPLICATION_JSON_VALUE)
    @Secured({"UseABX"})
    public String menu(final HttpServletRequest request) {
        String user = request.getUserPrincipal().getName();
        JSONObject jsonMenu = new JSONObject();
        jsonMenu.put("dashboards", dashboardController.getDashboards(user));
        jsonMenu.put("execs", executionsController.getExecutions(user));
        jsonMenu.put("projects", projectsController.getProjects(user));
        return jsonMenu.toString();
    }
}
