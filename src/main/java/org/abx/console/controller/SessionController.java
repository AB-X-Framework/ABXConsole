package org.abx.console.controller;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/session")
public class SessionController {


    @RequestMapping("/login")
    @PreAuthorize("permitAll()")
    public void login(final HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        try {
            request.login("test@abx.com", "test");

        } catch (ServletException e) {
            e.printStackTrace();
        }
        response.sendRedirect("/resources/index.html");
    }

}
