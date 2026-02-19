package com.example.sample.service;

import com.example.sample.model.Admin;
import com.example.sample.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class AdminService {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AdminService(AdminRepository adminRepository, PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Get all active admins (is_delete = false)
    public List<Admin> getAllAdmins() {
        return adminRepository.findByIsDelete(false);
    }

    // Get admin by ID
    public Admin getAdminById(Integer id) {
        return adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
    }

    // Create admin
    public Admin createAdmin(Admin admin) {
        // Validate required fields
        if (admin.getUsername() == null || admin.getUsername().trim().isEmpty()) {
            throw new RuntimeException("Username is required");
        }
        if (admin.getName() == null || admin.getName().trim().isEmpty()) {
            throw new RuntimeException("Name is required");
        }
        if (admin.getPassword() == null || admin.getPassword().isEmpty()) {
            throw new RuntimeException("Password is required");
        }
        if (admin.getType() == null || admin.getType().trim().isEmpty()) {
            throw new RuntimeException("Type is required");
        }

        // Validate username length
        if (admin.getUsername().length() < 3) {
            throw new RuntimeException("Username must be at least 3 characters");
        }

        // Validate name length
        if (admin.getName().length() < 2) {
            throw new RuntimeException("Name must be at least 2 characters");
        }

        // Validate password length
        if (admin.getPassword().length() < 8) {
            throw new RuntimeException("Password must be at least 8 characters");
        }

        // Validate type
        String type = admin.getType().toLowerCase();
        if (!type.equals("superadmin") && !type.equals("admin") &&
            !type.equals("moderator") && !type.equals("viewer")) {
            throw new RuntimeException("Invalid admin type. Must be: superadmin, admin, moderator, or viewer");
        }

        // Check if username already exists
        if (adminRepository.existsByUsername(admin.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        // Set timestamps and default values
        LocalDateTime now = LocalDateTime.now();
        admin.setCreatedAt(now);
        admin.setUpdatedAt(now);
        admin.setIsDelete(false);

        // Encode password
        admin.setPassword(passwordEncoder.encode(admin.getPassword()));

        return adminRepository.save(admin);
    }

    // Update admin
    public Admin updateAdmin(Admin admin) {
        // Validate required fields
        if (admin.getId() == null) {
            throw new RuntimeException("Admin ID is required");
        }
        if (admin.getUsername() == null || admin.getUsername().trim().isEmpty()) {
            throw new RuntimeException("Username is required");
        }
        if (admin.getName() == null || admin.getName().trim().isEmpty()) {
            throw new RuntimeException("Name is required");
        }
        if (admin.getPassword() == null || admin.getPassword().isEmpty()) {
            throw new RuntimeException("Password is required");
        }
        if (admin.getType() == null || admin.getType().trim().isEmpty()) {
            throw new RuntimeException("Type is required");
        }

        // Validate username length
        if (admin.getUsername().length() < 3) {
            throw new RuntimeException("Username must be at least 3 characters");
        }

        // Validate name length
        if (admin.getName().length() < 2) {
            throw new RuntimeException("Name must be at least 2 characters");
        }

        // Validate password length
        if (admin.getPassword().length() < 8) {
            throw new RuntimeException("Password must be at least 8 characters");
        }

        // Validate type
        String type = admin.getType().toLowerCase();
        if (!type.equals("superadmin") && !type.equals("admin") &&
            !type.equals("moderator") && !type.equals("viewer")) {
            throw new RuntimeException("Invalid admin type. Must be: superadmin, admin, moderator, or viewer");
        }

        Admin existing = adminRepository.findById(admin.getId())
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        // Check if username is being changed and if it already exists
        if (!existing.getUsername().equals(admin.getUsername())) {
            if (adminRepository.existsByUsername(admin.getUsername())) {
                throw new RuntimeException("Username already exists");
            }
        }

        existing.setUsername(admin.getUsername());
        existing.setName(admin.getName());
        existing.setType(admin.getType());
        existing.setUpdatedAt(LocalDateTime.now());

        // Encode password
        existing.setPassword(passwordEncoder.encode(admin.getPassword()));

        return adminRepository.save(existing);
    }

    // Soft delete admin
    public void deleteAdmin(Integer id) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (admin.getIsDelete()) {
            throw new RuntimeException("Admin already deleted");
        }

        // Check if this is the last active superadmin
        if ("superadmin".equalsIgnoreCase(admin.getType())) {
            long activeSuperadmins = adminRepository.countByTypeAndIsDelete("superadmin", false);
            if (activeSuperadmins <= 1) {
                throw new RuntimeException("Cannot delete last active superadmin");
            }
        }

        admin.setIsDelete(true);
        admin.setUpdatedAt(LocalDateTime.now());
        adminRepository.save(admin);
    }

    // Login admin
    public Admin loginAdmin(String username, String password) {
        // Validate input
        if (username == null || username.trim().isEmpty()) {
            throw new RuntimeException("Username is required");
        }
        if (password == null || password.isEmpty()) {
            throw new RuntimeException("Password is required");
        }

        // Find admin by username (only active admins)
        Admin admin = adminRepository.findByUsernameAndIsDelete(username, false)
                .orElseThrow(() -> new RuntimeException("Invalid username or password"));

        // Double-check if account is deleted
        if (admin.getIsDelete()) {
            throw new RuntimeException("Account has been deleted");
        }

        // Verify password
        if (!passwordEncoder.matches(password, admin.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }

        return admin;
    }

    // Restore deleted admin (optional)
    public Admin restoreAdmin(Integer id) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (!admin.getIsDelete()) {
            throw new RuntimeException("Admin is not deleted");
        }

        admin.setIsDelete(false);
        admin.setUpdatedAt(LocalDateTime.now());
        return adminRepository.save(admin);
    }

    // Get all deleted admins (optional)
    public List<Admin> getDeletedAdmins() {
        return adminRepository.findByIsDelete(true);
    }
}