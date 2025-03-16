package org.abx.console.spring;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {
        "org.abx.console.spring",
        "org.abx.console.creds",
        "org.abx.services",
        "org.abx.console.controller"})
public class ABXConsoleEntry {

    public static void main(String[] args) {
        SpringApplication.run(ABXConsoleEntry.class, args);

    }

}
