package com.example.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/vi1/admin")
public class AdminController {

    /**
     * Sensitive endpoint: http://localhost:8080/api/vi1/admin
     * Requires valid JWT token with ROLE_ADMIN only (as defined in your SecurityConfiguration).
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> adminEndpoint(Authentication authentication) {
        return ResponseEntity.ok(Map.of(
                "message", "Welcome to the ADMIN endpoint! Access granted.",
                "username", authentication.getName(),
                "authorities", authentication.getAuthorities().toString(),
                "status", "success",
                "note", "Only users with ROLE_ADMIN can access this endpoint"
        ));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, String>> adminDashboard(Authentication authentication) {
        return ResponseEntity.ok(Map.of(
                "message", "Admin Dashboard",
                "user", authentication.getName(),
                "access", "Restricted to ROLE_ADMIN"
        ));
    }
}
