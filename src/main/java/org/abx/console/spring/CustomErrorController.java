package org.abx.console.spring;

import jakarta.servlet.http.HttpServletRequest;
import jdk.jfr.StackTrace;
import org.json.JSONObject;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class CustomErrorController implements ErrorController {

    @GetMapping("/error")
    public String handleError(HttpServletRequest request) {
        return "redirect:/resources/Welcome.html";
    }

    public static JSONObject error(String message){
        JSONObject obj = new JSONObject();
        obj.put("error",true);
        obj.put("message", message);
        return obj;
    }
    public static String errorString(String message){
        return error(message).toString();
    }
}