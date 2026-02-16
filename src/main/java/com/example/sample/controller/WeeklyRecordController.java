package com.example.sample.controller;

import com.example.sample.model.WeeklyRecord;
import com.example.sample.service.WeeklyRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/records")
public class WeeklyRecordController {

    private final WeeklyRecordService recordService;

    @Autowired
    public WeeklyRecordController(WeeklyRecordService recordService) {
        this.recordService = recordService;
    }

    @GetMapping
    public ResponseEntity<List<WeeklyRecord>> getAllRecords() {
        List<WeeklyRecord> records = recordService.getAllRecords();
        return ResponseEntity.ok(records);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRecordById(@PathVariable Integer id) {
        return recordService.getRecordById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(createErrorResponse("Record not found with id: " + id)));
    }

    @GetMapping("/person/{personId}")
    public ResponseEntity<List<WeeklyRecord>> getRecordsByPersonId(@PathVariable Integer personId) {
        List<WeeklyRecord> records = recordService.getRecordsByPersonId(personId);
        return ResponseEntity.ok(records);
    }

    @GetMapping("/semester/{semesterId}")
    public ResponseEntity<List<WeeklyRecord>> getRecordsBySemesterId(@PathVariable Integer semesterId) {
        List<WeeklyRecord> records = recordService.getRecordsBySemesterId(semesterId);
        return ResponseEntity.ok(records);
    }

    @GetMapping("/person/{personId}/semester/{semesterId}")
    public ResponseEntity<List<WeeklyRecord>> getRecordsByPersonAndSemester(
            @PathVariable Integer personId,
            @PathVariable Integer semesterId) {
        List<WeeklyRecord> records = recordService.getRecordsByPersonAndSemester(personId, semesterId);
        return ResponseEntity.ok(records);
    }

    @PostMapping
    public ResponseEntity<?> createRecord(
            @RequestBody WeeklyRecord record,
            @RequestParam Integer participationId) {
        try {
            WeeklyRecord createdRecord = recordService.createRecord(record, participationId);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdRecord);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRecord(@PathVariable Integer id, @RequestBody WeeklyRecord recordDetails) {
        try {
            WeeklyRecord updatedRecord = recordService.updateRecord(id, recordDetails);
            return ResponseEntity.ok(updatedRecord);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRecord(@PathVariable Integer id) {
        try {
            recordService.deleteRecord(id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Record deleted successfully");
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