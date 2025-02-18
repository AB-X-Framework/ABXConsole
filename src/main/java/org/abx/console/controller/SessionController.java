package org.abx.console.controller;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.json.JSONObject;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/session")
public class SessionController {


    @RequestMapping(value = "/login", produces = "application/json")
    @PreAuthorize("permitAll()")
    public String login(final HttpServletRequest request,
                        @RequestParam String username,
                        @RequestParam String password) {
        JSONObject status = new JSONObject();
        try {
            request.login(username, password);
            status.put("logged", true);
        } catch (ServletException e) {
            e.printStackTrace();
            status.put("logged", false);
            status.put("error", e.getMessage());
        }
        return status.toString(1);
    }

    @RequestMapping(value = "/isLoggedIn", produces = "application/json")
    @PreAuthorize("permitAll()")
    public boolean isLoggedIn(final HttpServletRequest request) {
        return request.getUserPrincipal() != null && request.getUserPrincipal().getName() != null;
    }
}
