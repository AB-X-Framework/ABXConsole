package org.abx.console.utils;


import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import org.abx.console.creds.CredsDataLoader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/utils")
public class UtilController {
    @Autowired
    private CredsDataLoader dataLoader;

    /**
     * @param message
     */
    @GetMapping(path = "/print")
    public String print(@RequestParam("message") String message) {
        return "Your message " + message;
    }


    @GetMapping(path = "/register")
    public String register() {
        dataLoader.
                createUserIfNotFound("admin@abx.com",
                        "abx", "Admin");
        return "User registered";
    }

    @GetMapping("/login")
    public String login(final HttpServletRequest request) {
        try {
            request.login("admin@abx.com", "abx");
            return "Logged in" + request.getUserPrincipal().getName();
        } catch (ServletException e) {
            e.printStackTrace();
            return "Login failed " + e.getMessage();
        }
    }


    @GetMapping(path = "/loggedPrint")
    @PreAuthorize("isAuthenticated()")
    public String loggedPrint(Principal p, @RequestParam("message") String message) {
        return "Your message " + message + " " + p.getName();
    }

    @GetMapping(path = "/check")
    @Secured({"Admin"})
    public String check(Principal p) {
        return "Your message + " + p.getName();
    }


}
