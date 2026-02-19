package com.example.sample.config;

import com.example.sample.model.*;
import com.example.sample.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private SemesterRepository semesterRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Check if data already exists
        if (adminRepository.count() > 0) {
            System.out.println("Data already initialized. Skipping...");
            return;
        }

        System.out.println("Initializing default data...");

        // Create default admin
        Admin admin = new Admin();
        admin.setUsername("admin");
        admin.setName("System Administrator");
        admin.setPassword(passwordEncoder.encode("password123"));
        admin.setType("superadmin");
        admin.setIsDelete(false);
        adminRepository.save(admin);
        System.out.println("Created default admin: username=admin, password=password123, type=superadmin");

        // Create default persons
        Person person1 = new Person("John Doe", passwordEncoder.encode("password123"));
        Person person2 = new Person("Jane Smith", passwordEncoder.encode("password123"));
        Person person3 = new Person("Bob Johnson", passwordEncoder.encode("password123"));
        personRepository.save(person1);
        personRepository.save(person2);
        personRepository.save(person3);
        System.out.println("Created 3 default persons: John Doe, Jane Smith, Bob Johnson");

        // Create default groups
        Group group1 = new Group("Spring 2026 Reading Group");
        Group group2 = new Group("Advanced Java Study Group");
        groupRepository.save(group1);
        groupRepository.save(group2);
        System.out.println("Created 2 default groups");

        // Add persons to groups
        group1.getPersons().add(person1);
        group1.getPersons().add(person2);
        group2.getPersons().add(person2);
        group2.getPersons().add(person3);
        groupRepository.save(group1);
        groupRepository.save(group2);
        System.out.println("Added persons to groups");

        // Create default semesters
        Semester semester1 = new Semester(
            "Spring 2026",
            LocalDate.of(2026, 3, 1),
            LocalDate.of(2026, 6, 30)
        );
        Semester semester2 = new Semester(
            "Fall 2026",
            LocalDate.of(2026, 9, 1),
            LocalDate.of(2026, 12, 31)
        );
        semesterRepository.save(semester1);
        semesterRepository.save(semester2);
        System.out.println("Created 2 default semesters: Spring 2026, Fall 2026");

        // Add groups to semesters
        semester1.getGroups().add(group1);
        semester1.getGroups().add(group2);
        semester2.getGroups().add(group2);
        semesterRepository.save(semester1);
        semesterRepository.save(semester2);
        System.out.println("Added groups to semesters");

        System.out.println("==============================================");
        System.out.println("Default data initialization completed!");
        System.out.println("==============================================");
        System.out.println("Login credentials:");
        System.out.println("  Username: admin");
        System.out.println("  Password: password123");
        System.out.println("==============================================");
        System.out.println("Database contains:");
        System.out.println("  - 1 Admin user");
        System.out.println("  - 3 Persons (John Doe, Jane Smith, Bob Johnson)");
        System.out.println("  - 2 Groups (Spring 2026 Reading Group, Advanced Java Study Group)");
        System.out.println("  - 2 Semesters (Spring 2026, Fall 2026)");
        System.out.println("==============================================");
    }
}