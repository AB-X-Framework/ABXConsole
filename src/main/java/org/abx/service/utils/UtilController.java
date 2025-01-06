package org.abx.service.utils;


import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import org.abx.service.creds.model.Role;
import org.abx.service.spring.SetupDataLoader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import java.security.Principal;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

@RestController
@RequestMapping("/utils")
public class UtilController {
    @Autowired
    private SetupDataLoader dataLoader;
    /**
     * @param message
     */
    @GetMapping(path = "/print")
    public String print(@RequestParam("message")String message) {
        return "Your message "+message;
    }


    @GetMapping(path = "/register")
    public String register() {

        HashSet<Role> roles = new HashSet<>();
        roles.add(dataLoader.createRoleIfNotFound("ROLE_ADMIN",null));
        dataLoader.
                createUserIfNotFound("abx@abx.com",
                         "abx",roles);
        return "User registered";
    }
    @GetMapping("/login")
    public String login(final HttpServletRequest request)  {
      try {
          request.login("abx@abx.com", "abx");

          return "Logged in"+request.getUserPrincipal().getName();
      }catch (ServletException e) {
          e.printStackTrace();
          return "Login failed "+e.getMessage();
      }
    }


    @GetMapping(path = "/loggedPrint")
    @PreAuthorize("isAuthenticated()")
    public String loggedPrint(Principal p, @RequestParam("message")String message) {
        return "Your message "+message+" "+p.getName();
    }
    @GetMapping(path = "/check")
    @Secured({"ROLE_ADMIN22"})
    public String check(Principal p) {
        return "Your message + "+p.getName();
    }



}
