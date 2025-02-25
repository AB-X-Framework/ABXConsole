package org.abx.console.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.abx.console.spring.CustomErrorController;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/rest")
public class UserController {

    @Autowired
    private DashboardsController dashboardController;
    @Autowired
    private ExecutionsController executionsController;
    @Autowired
    private ProjectsController projectsController;

    @RequestMapping(value = "/menu", produces = MediaType.APPLICATION_JSON_VALUE)
    @Secured({"UseABX"})
    public String menu(final HttpServletRequest request) throws Exception{
        try {
            String user = request.getUserPrincipal().getName();
            JSONObject jsonMenu = new JSONObject();
            JSONObject jsonDashboards =  dashboardController.getDashboards(user);
            if (jsonDashboards.has("error")){
                return jsonDashboards.toString();
            }
            jsonMenu.put("dashboards",jsonDashboards.get("dashboards"));
            jsonMenu.put("execs", executionsController.getExecutions(user));
            JSONObject jsonProjects =  projectsController.getProjects(user);
            if (jsonProjects.has("error")){
                return jsonProjects.toString();
            }
            jsonMenu.put("projects",jsonProjects.get("projects"));
            return jsonMenu.toString();
        }catch (Exception e){
            return CustomErrorController.errorString("Cannot get user information");
        }
    }
}
