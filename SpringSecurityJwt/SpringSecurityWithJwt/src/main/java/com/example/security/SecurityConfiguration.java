package com.example.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider; // Inject your custom Auth Provider

    public SecurityConfiguration(JwtAuthenticationFilter jwtAuthFilter, AuthenticationProvider authenticationProvider) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.authenticationProvider = authenticationProvider;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. Disable CSRF (Stateless JWTs do not need CSRF protection)
            .csrf(AbstractHttpConfigurer::disable)
            
            // 2. Setup path-based authorization
            .authorizeHttpRequests(auth -> auth
                // Public endpoints (e.g. signup, login)
                .requestMatchers("/", "/api/vi1/auth/**").permitAll() 
                
                // Locked admin endpoint (Explicitly requires the "ADMIN" role)
                .requestMatchers("/api/vi1/admin/**").hasRole("ADMIN") 
                
                // All other endpoints require generic authentication
                .anyRequest().authenticated()
            )
            
            // 3. Use Stateless sessions (No HTTP Session cookies)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            // 4. Bind Authentication Provider
            .authenticationProvider(authenticationProvider)
            
            // 5. Add custom JWT filter before the standard authentication filter
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}