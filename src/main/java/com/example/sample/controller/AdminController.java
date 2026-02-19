package com.example.sample.controller;

import com.example.sample.model.Admin;
import com.example.sample.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    @Autowired
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // Get all active admins (is_delete = false)
    @GetMapping("/list")
    public ResponseEntity<List<Admin>> getAllAdmins() {
        List<Admin> admins = adminService.getAllAdmins();
        return ResponseEntity.ok(admins);
    }

    // Get admin by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getAdminById(@PathVariable Integer id) {
        try {
            Admin admin = adminService.getAdminById(id);
            return ResponseEntity.ok(admin);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    // Create admin
    @PostMapping("/create")
    public ResponseEntity<?> createAdmin(@RequestBody Admin admin) {
        try {
            Admin createdAdmin = adminService.createAdmin(admin);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdAdmin);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    // Update admin
    @PutMapping("/update")
    public ResponseEntity<?> updateAdmin(@RequestBody Admin admin) {
        try {
            Admin updatedAdmin = adminService.updateAdmin(admin);
            return ResponseEntity.ok(updatedAdmin);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(createErrorResponse(e.getMessage()));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    // Soft delete admin
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteAdmin(@PathVariable Integer id) {
        try {
            adminService.deleteAdmin(id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Admin deleted successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(createErrorResponse(e.getMessage()));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    // Login admin
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Admin admin = adminService.loginAdmin(request.getUsername(), request.getPassword());

            // Create response without password
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Login successful");
            response.put("admin", createAdminResponse(admin));

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = createErrorResponse(e.getMessage());

            // Return appropriate status code
            if (e.getMessage().contains("deleted")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }

    // Restore deleted admin (optional)
    @PutMapping("/restore/{id}")
    public ResponseEntity<?> restoreAdmin(@PathVariable Integer id) {
        try {
            Admin admin = adminService.restoreAdmin(id);
            return ResponseEntity.ok(admin);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(createErrorResponse(e.getMessage()));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    // Get deleted admins (optional)
    @GetMapping("/deleted")
    public ResponseEntity<List<Admin>> getDeletedAdmins() {
        List<Admin> admins = adminService.getDeletedAdmins();
        return ResponseEntity.ok(admins);
    }

    // Helper method to create error response
    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> error = new HashMap<>();
        error.put("success", false);
        error.put("message", message);
        return error;
    }

    // Helper method to create admin response without password
    private Map<String, Object> createAdminResponse(Admin admin) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", admin.getId());
        response.put("username", admin.getUsername());
        response.put("name", admin.getName());
        response.put("type", admin.getType());
        response.put("is_delete", admin.getIsDelete());
        response.put("created_at", admin.getCreatedAt());
        response.put("updated_at", admin.getUpdatedAt());
        return response;
    }

    // Login request DTO
    static class LoginRequest {
        private String username;
        private String password;

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }
}