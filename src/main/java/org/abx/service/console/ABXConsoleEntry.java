package org.abx.service.console;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {
        "org.abx.service.utils",
        "org.abx.service.console",
        "org.abx.service.spring"})
public class ABXConsoleEntry {

    public static void main(String[] args) {
        SpringApplication.run(ABXConsoleEntry.class, args);

    }

}
