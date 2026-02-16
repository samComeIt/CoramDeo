package com.example.sample.controller;

import com.example.sample.model.Participation;
import com.example.sample.service.ParticipationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> error = new HashMap<>();
        error.put("success", false);
        error.put("error", message);
        return error;
    }
}