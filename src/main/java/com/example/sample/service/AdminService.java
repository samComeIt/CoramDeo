package com.example.sample.service;

import com.example.sample.model.Admin;
import com.example.sample.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

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

    public Admin authenticate(String username, String password) {
        Optional<Admin> adminOpt = adminRepository.findByUsername(username);
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            if (passwordEncoder.matches(password, admin.getPassword())) {
                return admin;
            }
        }
        throw new IllegalArgumentException("Invalid username or password");
    }

    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    public Optional<Admin> getAdminById(Integer id) {
        return adminRepository.findById(id);
    }

    public Optional<Admin> getAdminByUsername(String username) {
        return adminRepository.findByUsername(username);
    }

    public Admin createAdmin(Admin admin) {
        if (adminRepository.existsByUsername(admin.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }
        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        return adminRepository.save(admin);
    }

    public Admin updateAdmin(Integer id, Admin adminDetails) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Admin not found with id: " + id));

        if (adminDetails.getUsername() != null && !adminDetails.getUsername().equals(admin.getUsername())) {
            if (adminRepository.existsByUsername(adminDetails.getUsername())) {
                throw new IllegalArgumentException("Username already exists");
            }
            admin.setUsername(adminDetails.getUsername());
        }

        if (adminDetails.getName() != null) {
            admin.setName(adminDetails.getName());
        }

        if (adminDetails.getPassword() != null && !adminDetails.getPassword().isEmpty()) {
            admin.setPassword(passwordEncoder.encode(adminDetails.getPassword()));
        }

        return adminRepository.save(admin);
    }

    public void deleteAdmin(Integer id) {
        if (!adminRepository.existsById(id)) {
            throw new IllegalArgumentException("Admin not found with id: " + id);
        }
        adminRepository.deleteById(id);
    }
}