package org.abx.service.utils;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/utils")
public class UtilController {

    /**
     * @param message
     */
    @GetMapping(path = "/print")
    public String print(@RequestParam("message")String message) {
        return "Your message "+message;
    }

}
