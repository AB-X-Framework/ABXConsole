package org.abx.console.controller;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/session")
public class SessionController {


    @GetMapping("/login")
    public String login(final HttpServletRequest request) {
        try {
            request.login("test@abx.com", "test");

            return "Logged in" + request.getUserPrincipal().getName();
        } catch (ServletException e) {
            e.printStackTrace();
            return "Login failed " + e.getMessage();
        }
    }

}
