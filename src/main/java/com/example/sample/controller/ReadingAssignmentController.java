package com.example.sample.controller;

import com.example.sample.model.ReadingAssignment;
import com.example.sample.service.ReadingAssignmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/assignments")
public class ReadingAssignmentController {

    private final ReadingAssignmentService assignmentService;

    @Autowired
    public ReadingAssignmentController(ReadingAssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    @GetMapping
    public ResponseEntity<List<ReadingAssignment>> getAllAssignments() {
        List<ReadingAssignment> assignments = assignmentService.getAllAssignments();
        return ResponseEntity.ok(assignments);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAssignmentById(@PathVariable Integer id) {
        return assignmentService.getAssignmentById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(createErrorResponse("Assignment not found with id: " + id)));
    }

    @GetMapping("/semester/{semesterId}")
    public ResponseEntity<List<ReadingAssignment>> getAssignmentsBySemesterId(@PathVariable Integer semesterId) {
        List<ReadingAssignment> assignments = assignmentService.getAssignmentsBySemesterId(semesterId);
        return ResponseEntity.ok(assignments);
    }

    @PostMapping
    public ResponseEntity<?> createAssignment(@RequestBody ReadingAssignment assignment, @RequestParam Integer semesterId) {
        try {
            ReadingAssignment createdAssignment = assignmentService.createAssignment(assignment, semesterId);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdAssignment);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAssignment(@PathVariable Integer id, @RequestBody ReadingAssignment assignmentDetails) {
        try {
            ReadingAssignment updatedAssignment = assignmentService.updateAssignment(id, assignmentDetails);
            return ResponseEntity.ok(updatedAssignment);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAssignment(@PathVariable Integer id) {
        try {
            assignmentService.deleteAssignment(id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Assignment deleted successfully");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
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