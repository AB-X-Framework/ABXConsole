package org.abx.console.spring;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jdk.jfr.StackTrace;
import org.json.JSONObject;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import java.io.IOException;

@Controller
public class CustomErrorController implements ErrorController {

    @GetMapping("/error")
    public String handleError() {
        return "redirect:/resources/Welcome.html";
    }

    @GetMapping("/favicon.ico")
    public void redirectFavicon(HttpServletResponse response) throws IOException {
        response.sendRedirect("/resources/icons/favicon.ico");
    }

}