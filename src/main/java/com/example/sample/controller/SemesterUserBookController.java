package com.example.sample.controller;

import com.example.sample.model.SemesterUserBook;
import com.example.sample.service.SemesterUserBookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/semester-user-books")
public class SemesterUserBookController {

    private final SemesterUserBookService semesterUserBookService;

    @Autowired
    public SemesterUserBookController(SemesterUserBookService semesterUserBookService) {
        this.semesterUserBookService = semesterUserBookService;
    }

    // Get all semester user books
    @GetMapping
    public ResponseEntity<List<SemesterUserBook>> getAllSemesterUserBooks() {
        List<SemesterUserBook> semesterUserBooks = semesterUserBookService.getAllSemesterUserBooks();
        return ResponseEntity.ok(semesterUserBooks);
    }

    // Get semester user book by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getSemesterUserBookById(@PathVariable Integer id) {
        return semesterUserBookService.getSemesterUserBookById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(createErrorResponse("SemesterUserBook not found with id: " + id)));
    }

    // Get semester user books by semester
    @GetMapping("/semester/{semesterId}")
    public ResponseEntity<List<SemesterUserBook>> getSemesterUserBooksBySemester(@PathVariable Integer semesterId) {
        List<SemesterUserBook> semesterUserBooks = semesterUserBookService.getSemesterUserBooksBySemester(semesterId);
        return ResponseEntity.ok(semesterUserBooks);
    }

    // Get semester user books by person
    @GetMapping("/person/{personId}")
    public ResponseEntity<List<SemesterUserBook>> getSemesterUserBooksByPerson(@PathVariable Integer personId) {
        List<SemesterUserBook> semesterUserBooks = semesterUserBookService.getSemesterUserBooksByPerson(personId);
        return ResponseEntity.ok(semesterUserBooks);
    }

    // Get semester user books by book
    @GetMapping("/book/{bookId}")
    public ResponseEntity<List<SemesterUserBook>> getSemesterUserBooksByBook(@PathVariable Integer bookId) {
        List<SemesterUserBook> semesterUserBooks = semesterUserBookService.getSemesterUserBooksByBook(bookId);
        return ResponseEntity.ok(semesterUserBooks);
    }

    // Get semester user books by semester and person
    @GetMapping("/semester/{semesterId}/person/{personId}")
    public ResponseEntity<List<SemesterUserBook>> getSemesterUserBooksBySemesterAndPerson(
            @PathVariable Integer semesterId,
            @PathVariable Integer personId) {
        List<SemesterUserBook> semesterUserBooks = semesterUserBookService.getSemesterUserBooksBySemesterAndPerson(semesterId, personId);
        return ResponseEntity.ok(semesterUserBooks);
    }

    // Get semester user books by semester and book
    @GetMapping("/semester/{semesterId}/book/{bookId}")
    public ResponseEntity<List<SemesterUserBook>> getSemesterUserBooksBySemesterAndBook(
            @PathVariable Integer semesterId,
            @PathVariable Integer bookId) {
        List<SemesterUserBook> semesterUserBooks = semesterUserBookService.getSemesterUserBooksBySemesterAndBook(semesterId, bookId);
        return ResponseEntity.ok(semesterUserBooks);
    }

    // Create semester user book
    @PostMapping
    public ResponseEntity<?> createSemesterUserBook(
            @RequestParam Integer semesterId,
            @RequestParam Integer personId,
            @RequestParam Integer bookId,
            @RequestBody SemesterUserBook semesterUserBook) {
        try {
            SemesterUserBook createdSemesterUserBook = semesterUserBookService.createSemesterUserBook(
                    semesterId, personId, bookId, semesterUserBook);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdSemesterUserBook);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    // Update semester user book
    @PutMapping("/{id}")
    public ResponseEntity<?> updateSemesterUserBook(
            @PathVariable Integer id,
            @RequestBody SemesterUserBook semesterUserBookData) {
        try {
            SemesterUserBook updatedSemesterUserBook = semesterUserBookService.updateSemesterUserBook(id, semesterUserBookData);
            return ResponseEntity.ok(updatedSemesterUserBook);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    // Delete semester user book
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSemesterUserBook(@PathVariable Integer id) {
        try {
            semesterUserBookService.deleteSemesterUserBook(id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "SemesterUserBook deleted successfully");
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