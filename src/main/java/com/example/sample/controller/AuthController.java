package com.example.sample.controller;

import com.example.sample.dto.LoginRequest;
import com.example.sample.dto.LoginResponse;
import com.example.sample.model.Admin;
import com.example.sample.security.JwtUtil;
import com.example.sample.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AdminService adminService;
    private final JwtUtil jwtUtil;

    @Autowired
    public AuthController(AdminService adminService, JwtUtil jwtUtil) {
        this.adminService = adminService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            Admin admin = adminService.loginAdmin(loginRequest.getUsername(), loginRequest.getPassword());

            String token = jwtUtil.generateToken(admin.getUsername(), admin.getId());

            LoginResponse response = new LoginResponse(
                    token,
                    admin.getId(),
                    admin.getUsername(),
                    admin.getName()
            );

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("deleted")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(createErrorResponse("Account has been deleted"));
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createErrorResponse("Invalid credentials"));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Admin admin) {
        try {
            Admin createdAdmin = adminService.createAdmin(admin);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Admin registered successfully");
            response.put("adminId", createdAdmin.getId());
            response.put("username", createdAdmin.getUsername());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> error = new HashMap<>();
        error.put("success", false);
        error.put("error", message);
        return error;
    }
}