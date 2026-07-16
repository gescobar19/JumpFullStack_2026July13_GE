package com.example.demo;

import com.example.demo.models.User;
import com.example.demo.services.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class UserServiceTest {

    @Autowired
    private UserService userService;

    @Test
    void shouldCreateUserSuccessfully() {
        User user = new User();
        user.setUsername("testuser");
        user.setPassword("test123");
        user.setName("Test User");
        user.setEmail("test@example.com");
        user.setRole("CUSTOMER");

        User saved = userService.createUser(user);

        assertNotNull(saved.getId());
        assertEquals("testuser", saved.getUsername());
    }

    @Test
    void shouldLoginSuccessfully() {
        // Create a user
        User user = new User();
        user.setUsername("loginuser");
        user.setPassword("login123");
        user.setName("Login User");
        user.setRole("CUSTOMER");
        userService.createUser(user);

        // Test login
        var result = userService.login("loginuser", "login123");

        assertTrue(result.isPresent());
        assertEquals("loginuser", result.get().getUsername());
    }

    @Test
    void shouldFailLoginWithWrongPassword() {
        var result = userService.login("loginuser", "wrongpassword");
        assertFalse(result.isPresent());
    }
}