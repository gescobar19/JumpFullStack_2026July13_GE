package com.example.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> home() {
        return ResponseEntity.ok(Map.of(
                "message", "SpringSecurityWithJwt is running (based on your uploaded files)",
                "endpoints", Map.of(
                        "login", "POST /api/vi1/auth/login",
                        "admin", "GET /api/vi1/admin  (requires JWT + ROLE_ADMIN)"
                ),
                "testUsers", Map.of(
                        "admin", "username=admin, password=admin123, role=ROLE_ADMIN",
                        "user", "username=user, password=user123, role=ROLE_USER"
                )
        ));
    }
}
