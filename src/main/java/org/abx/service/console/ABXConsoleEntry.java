package org.abx.service.console;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {
        "org.abx.service.utils",
        "org.abx.service.console",
        "org.abx.service.spring"})
@EnableJpaRepositories(value={"org.abx.service.creds.dao"})
@EntityScan(value = {"org.abx.service.creds.model"})
public class ABXConsoleEntry {

    public static void main(String[] args) {
        SpringApplication.run(ABXConsoleEntry.class, args);

    }

}
