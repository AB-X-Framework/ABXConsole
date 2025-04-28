package org.abx.console.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.abx.jwt.JWTUtils;
import org.abx.spring.ErrorMessage;
import org.json.JSONObject;
import org.springframework.http.MediaType;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rest")
public class DashboardsController extends ServicesClientController{


    @GetMapping(value = "/dashboards", produces = MediaType.APPLICATION_JSON_VALUE)
    @Secured("UseABX")
    public String dashboards(final HttpServletRequest request) {
        return getDashboards(request.getUserPrincipal().getName()).toString();
    }

    @PostMapping(value = "/dashboards", produces = MediaType.APPLICATION_JSON_VALUE)
    @Secured("UseABX")
    public String createDashboard(HttpServletRequest request,
                                  @RequestParam String name) throws Exception {
        try {
            JSONObject result = new JSONObject();
            return result.put("id", persistence(request).post(  "/persistence/dashboards").
                    addPart("dashboardName", name).process().asLong()).toString();
        } catch (Exception e) {
            return ErrorMessage.errorString("Cannot create " + name + " dashboard." + e.getMessage());
        }
    }

    protected JSONObject getDashboards(String username) {
        try {
            String token = JWTUtils.generateToken(username, privateKey, 60,
                    List.of("Persistence"));
            JSONObject result = new JSONObject();
            return result.put("dashboards", servicesClient.get("persistence",
                    "/persistence/dashboards").jwt(token).process().asJSONArray());
        } catch (Exception e) {
            return ErrorMessage.error("Cannot collect user dashboards.");
        }
    }

    @Secured("Persistence")
    @GetMapping(value = "/dashboards/{dashboardId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public String getDashboard(HttpServletRequest request,
                               @PathVariable long dashboardId) {
        try {
            String username = request.getUserPrincipal().getName();
            String token = JWTUtils.generateToken(username, privateKey, 60,
                    List.of("Persistence"));
            return servicesClient.get("persistence",
                    "/persistence/dashboards/" + dashboardId).jwt(token).process().asString();
        } catch (Exception e) {
            return ErrorMessage.errorString("Cannot get dashboard data for" + dashboardId);
        }
    }

    @Secured("Persistence")
    @DeleteMapping(value = "/dashboards/{dashboardId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public String deleteDashboard(HttpServletRequest request,
                                  @PathVariable long dashboardId) {
        try {
            String username = request.getUserPrincipal().getName();
            String token = JWTUtils.generateToken(username, privateKey, 60,
                    List.of("Persistence"));
            JSONObject result = new JSONObject();
            boolean success = servicesClient.delete("persistence",
                    "/persistence/dashboards/" + dashboardId).jwt(token).process().asBoolean();
            result.put("success", success);
            return result.toString();
        } catch (Exception e) {
            return ErrorMessage.errorString("Cannot get dashboard data for " + dashboardId);
        }
    }

}
