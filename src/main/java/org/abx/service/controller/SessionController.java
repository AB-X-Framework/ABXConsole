package org.abx.service.controller;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.PostMapping;

public class SessionController {


    @PostMapping("/login")
    public String login(final HttpServletRequest request) {
        try {
            request.login("abx@abx.com", "abx");

            return "Logged in" + request.getUserPrincipal().getName();
        } catch (ServletException e) {
            e.printStackTrace();
            return "Login failed " + e.getMessage();
        }
    }

}
