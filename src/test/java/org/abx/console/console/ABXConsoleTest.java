package org.abx.console.console;

import org.abx.console.spring.ABXConsoleEntry;
import org.abx.jwt.JWTUtils;
import org.abx.services.ServicesClient;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ConfigurableApplicationContext;

@SpringBootTest(classes = ABXConsoleEntry.class)
class ABXConsoleTest {

	@Autowired
	JWTUtils jwtUtils;

	private static ConfigurableApplicationContext context;
	@Autowired
	ServicesClient servicesClient;

	@Value("${jwt.private}")
	private String privateKey;

	@BeforeAll
	public static void setup() {
		context= SpringApplication.run(ABXConsoleEntry.class);
	}

	@Test
	public void doBasicTest() {
	}

	@AfterAll
	public static void teardown() {
		context.stop();
	}

}
