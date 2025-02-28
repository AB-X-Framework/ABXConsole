package org.abx.console.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.abx.console.spring.CustomErrorController;
import org.abx.jwt.JWTUtils;
import org.abx.services.ServicesClient;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
@RestController
@RequestMapping("/rest")
public class RepoController {
    @Value("${jwt.private}")
    private String privateKey;

    @Autowired
    ServicesClient servicesClient;


    @PostMapping(value = "/repo/validate", produces = MediaType.APPLICATION_JSON_VALUE)
    @Secured("UseABX")
    public String validateCreds(HttpServletRequest request,
            @RequestParam String url, @RequestParam String branch,
            @RequestParam String engine,   @RequestParam String creds) throws Exception {

        String username = request.getUserPrincipal().getName();
        String token = JWTUtils.generateToken(username, privateKey, 60,
                List.of("Repository"));
        JSONObject result = new JSONObject();
        try {
            return result.put("id", servicesClient.post("repository",
                    "/repository/validate").jwt(token).
                    addPart("url",url).
                    addPart("branch",branch).
                    addPart("engine",engine).
                    addPart("creds",creds).process().asBoolean()).toString();
        }catch (Exception e){
            return CustomErrorController.errorString("Cannot validate repository."+e.getMessage());
        }
    }

}
