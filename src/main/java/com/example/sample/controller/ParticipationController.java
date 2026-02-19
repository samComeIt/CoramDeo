package com.example.sample.controller;

import com.example.sample.model.Participation;
import com.example.sample.service.ParticipationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/participations")
public class ParticipationController {

    private final ParticipationService participationService;

    @Autowired
    public ParticipationController(ParticipationService participationService) {
        this.participationService = participationService;
    }

    @GetMapping
    public ResponseEntity<List<Participation>> getAllParticipations() {
        List<Participation> participations = participationService.getAllParticipations();
        return ResponseEntity.ok(participations);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getParticipationById(@PathVariable Integer id) {
        return participationService.getParticipationById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(createErrorResponse("Participation not found with id: " + id)));
    }

    @GetMapping("/semester/{semesterId}")
    public ResponseEntity<List<Participation>> getParticipationsBySemester(@PathVariable Integer semesterId) {
        List<Participation> participations = participationService.getParticipationsBySemester(semesterId);
        return ResponseEntity.ok(participations);
    }

    @GetMapping("/group/{groupId}")
    public ResponseEntity<List<Participation>> getParticipationsByGroup(@PathVariable Integer groupId) {
        List<Participation> participations = participationService.getParticipationsByGroup(groupId);
        return ResponseEntity.ok(participations);
    }

    @GetMapping("/person/{personId}")
    public ResponseEntity<List<Participation>> getParticipationsByPerson(@PathVariable Integer personId) {
        List<Participation> participations = participationService.getParticipationsByPerson(personId);
        return ResponseEntity.ok(participations);
    }

    @PostMapping
    public ResponseEntity<?> createParticipation(
            @RequestBody Participation participation,
            @RequestParam Integer semesterId,
            @RequestParam Integer groupId,
            @RequestParam Integer personId) {
        try {
            Participation createdParticipation = participationService.createParticipation(
                participation, semesterId, groupId, personId);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdParticipation);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateParticipation(@PathVariable Integer id, @RequestBody Participation participationDetails) {
        try {
            Participation updatedParticipation = participationService.updateParticipation(id, participationDetails);
            return ResponseEntity.ok(updatedParticipation);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteParticipation(@PathVariable Integer id) {
        try {
            participationService.deleteParticipation(id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Participation deleted successfully");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    // Search with filters and pagination
    @GetMapping("/search")
    public ResponseEntity<?> searchParticipations(
            @RequestParam(required = false) Integer semesterId,
            @RequestParam(required = false) Integer groupId,
            @RequestParam(required = false) Integer personId,
            @RequestParam(required = false) String status,
            @RequestParam(required = true) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = true) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "participationDate,desc") String sort) {

        // Validate that startDate is not after endDate
        if (startDate.isAfter(endDate)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse("Start date must not be after end date"));
        }

        String[] sortParams = sort.split(",");
        Sort.Direction direction = sortParams.length > 1 &&
            sortParams[1].equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;

        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortParams[0]));

        Page<Participation> participations = participationService.searchParticipations(
            semesterId, groupId, personId, status, startDate, endDate, pageable);

        return ResponseEntity.ok(participations);
    }

    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> error = new HashMap<>();
        error.put("success", false);
        error.put("error", message);
        return error;
    }
}