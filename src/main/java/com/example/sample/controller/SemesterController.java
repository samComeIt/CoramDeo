package com.example.sample.controller;

import com.example.sample.model.Book;
import com.example.sample.model.Group;
import com.example.sample.model.Semester;
import com.example.sample.service.SemesterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/admin/semesters")
public class SemesterController {

    private final SemesterService semesterService;

    @Autowired
    public SemesterController(SemesterService semesterService) {
        this.semesterService = semesterService;
    }

    // Get all semesters
    @GetMapping
    public ResponseEntity<List<Semester>> getAllSemesters() {
        List<Semester> semesters = semesterService.getAllSemesters();
        return ResponseEntity.ok(semesters);
    }

    // Get semester by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getSemesterById(@PathVariable Integer id) {
        return semesterService.getSemesterById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(createErrorResponse("Semester not found with id: " + id)));
    }

    // Create semester
    @PostMapping
    public ResponseEntity<?> createSemester(@RequestBody Semester semester) {
        try {
            Semester createdSemester = semesterService.createSemester(semester);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdSemester);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    // Update semester
    @PutMapping("/{id}")
    public ResponseEntity<?> updateSemester(@PathVariable Integer id, @RequestBody Semester semesterDetails) {
        try {
            Semester updatedSemester = semesterService.updateSemester(id, semesterDetails);
            return ResponseEntity.ok(updatedSemester);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    // Delete semester
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSemester(@PathVariable Integer id) {
        try {
            semesterService.deleteSemester(id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Semester deleted successfully");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    // Get all groups in a semester
    @GetMapping("/{id}/groups")
    public ResponseEntity<?> getSemesterGroups(@PathVariable Integer id) {
        try {
            Set<Group> groups = semesterService.getSemesterGroups(id);
            return ResponseEntity.ok(groups);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    // Add group to semester (after semester is created)
    @PostMapping("/{id}/groups")
    public ResponseEntity<?> addGroupToSemester(@PathVariable Integer id, @RequestParam Integer groupId) {
        try {
            Semester updatedSemester = semesterService.addGroupToSemester(id, groupId);
            return ResponseEntity.ok(updatedSemester);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    // Remove group from semester
    @DeleteMapping("/{id}/groups/{groupId}")
    public ResponseEntity<?> removeGroupFromSemester(@PathVariable Integer id, @PathVariable Integer groupId) {
        try {
            Semester updatedSemester = semesterService.removeGroupFromSemester(id, groupId);
            return ResponseEntity.ok(updatedSemester);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    // Get all books in a semester
    @GetMapping("/{id}/books")
    public ResponseEntity<?> getSemesterBooks(@PathVariable Integer id) {
        try {
            Set<Book> books = semesterService.getSemesterBooks(id);
            return ResponseEntity.ok(books);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    // Add book to semester
    @PostMapping("/{id}/books")
    public ResponseEntity<?> addBookToSemester(@PathVariable Integer id, @RequestParam Integer bookId) {
        try {
            Semester updatedSemester = semesterService.addBookToSemester(id, bookId);
            return ResponseEntity.ok(updatedSemester);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    // Remove book from semester
    @DeleteMapping("/{id}/books/{bookId}")
    public ResponseEntity<?> removeBookFromSemester(@PathVariable Integer id, @PathVariable Integer bookId) {
        try {
            Semester updatedSemester = semesterService.removeBookFromSemester(id, bookId);
            return ResponseEntity.ok(updatedSemester);
        } catch (IllegalArgumentException e) {
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