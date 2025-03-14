package org.abx.console.spring;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import java.io.PrintWriter;

@EnableWebSecurity
@Configuration
@EnableMethodSecurity(securedEnabled = true)
public class SecConfiguration {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(11);
    }


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable).
                authorizeHttpRequests(authz -> {
                    authz
                            .requestMatchers("resources/**")
                            .permitAll()
                            .requestMatchers("session/**")
                            .permitAll()
                            .requestMatchers("gateway/**")
                            .permitAll()
                            .requestMatchers("error").permitAll()
                            .anyRequest()
                            .authenticated();
                }).exceptionHandling(security -> {
                    security.authenticationEntryPoint(
                            (request, response, authException) -> {
                                response.sendRedirect("/resources/Welcome.html");
                            }
                    );

                });
        return http.build();
    }
}
