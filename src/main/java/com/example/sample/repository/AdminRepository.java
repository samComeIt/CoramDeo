package com.example.sample.repository;

import com.example.sample.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Integer> {

    // Find all active (not deleted) admins
    List<Admin> findByIsDelete(Boolean isDelete);

    // Find admin by username (only active)
    Optional<Admin> findByUsernameAndIsDelete(String username, Boolean isDelete);

    // Find admin by username (including deleted)
    Optional<Admin> findByUsername(String username);

    // Check if username exists (including deleted)
    Boolean existsByUsername(String username);

    // Count active superadmins
    Long countByTypeAndIsDelete(String type, Boolean isDelete);

    // Find admins created after a certain date
    List<Admin> findByCreatedAtAfter(LocalDateTime date);

    // Find admins updated within a date range
    List<Admin> findByUpdatedAtBetween(LocalDateTime start, LocalDateTime end);
}