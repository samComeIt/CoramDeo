package com.example.sample.controller;

import com.example.sample.dto.LoginRequest;
import com.example.sample.dto.LoginResponse;
import com.example.sample.model.*;
import com.example.sample.security.JwtUtil;
import com.example.sample.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final PersonService personService;
    private final ParticipationService participationService;
    private final WeeklyRecordService recordService;
    private final JwtUtil jwtUtil;

    @Autowired
    public UserController(PersonService personService,
                          ParticipationService participationService,
                          WeeklyRecordService recordService,
                          JwtUtil jwtUtil) {
        this.personService = personService;
        this.participationService = participationService;
        this.recordService = recordService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            Person person = personService.authenticate(loginRequest.getUsername(), loginRequest.getPassword());

            String token = jwtUtil.generateToken(person.getName(), person.getPersonId());

            LoginResponse response = new LoginResponse(
                    token,
                    person.getPersonId(),
                    person.getName(),
                    person.getName()
            );

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createErrorResponse("Invalid name or password"));
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        try {
            // In a real app, get userId from JWT token
            // For now, we'll require it as a parameter or from security context
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Profile endpoint - implement JWT extraction");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/{personId}/semesters")
    public ResponseEntity<?> getUserSemesters(@PathVariable Integer personId) {
        try {
            Person person = personService.getPersonById(personId)
                    .orElseThrow(() -> new IllegalArgumentException("Person not found"));

            // Get all participations for this person
            List<Participation> participations = participationService.getParticipationsByPerson(personId);

            // Group by semester and group
            Map<Integer, Map<String, Object>> semesterMap = new LinkedHashMap<>();

            for (Participation participation : participations) {
                Integer semesterId = participation.getSemester().getSemesterId();
                String semesterName = participation.getSemester().getName();
                Integer groupId = participation.getGroup().getGroupId();
                String groupName = participation.getGroup().getGroupName();

                semesterMap.putIfAbsent(semesterId, new HashMap<>());
                Map<String, Object> semesterData = semesterMap.get(semesterId);

                semesterData.put("semesterId", semesterId);
                semesterData.put("semesterName", semesterName);
                semesterData.put("sdate", participation.getSemester().getSdate());
                semesterData.put("edate", participation.getSemester().getEdate());

                // Use a Map to track unique groups by groupId
                @SuppressWarnings("unchecked")
                Map<Integer, Map<String, Object>> groupsMap = (Map<Integer, Map<String, Object>>)
                    semesterData.computeIfAbsent("groupsMap", k -> new LinkedHashMap<>());

                // Only add group if not already present
                if (!groupsMap.containsKey(groupId)) {
                    Map<String, Object> groupData = new HashMap<>();
                    groupData.put("groupId", groupId);
                    groupData.put("groupName", groupName);
                    groupData.put("participationDate", participation.getParticipationDate());
                    groupsMap.put(groupId, groupData);
                }
            }

            // Convert groupsMap to groups list for each semester
            for (Map<String, Object> semesterData : semesterMap.values()) {
                @SuppressWarnings("unchecked")
                Map<Integer, Map<String, Object>> groupsMap = (Map<Integer, Map<String, Object>>)
                    semesterData.remove("groupsMap");
                if (groupsMap != null) {
                    semesterData.put("groups", new ArrayList<>(groupsMap.values()));
                }
            }

            Map<String, Object> response = new HashMap<>();
            response.put("personId", personId);
            response.put("personName", person.getName());
            response.put("semesters", new ArrayList<>(semesterMap.values()));

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/{personId}/participations")
    public ResponseEntity<?> getUserParticipations(
            @PathVariable Integer personId,
            @RequestParam(required = false) Integer semesterId,
            @RequestParam(required = false) Integer groupId) {
        try {
            List<Participation> participations;

            if (semesterId != null && groupId != null) {
                participations = participationService.getParticipationsBySemester(semesterId)
                        .stream()
                        .filter(p -> p.getPerson().getPersonId().equals(personId) &&
                                     p.getGroup().getGroupId().equals(groupId))
                        .collect(Collectors.toList());
            } else if (semesterId != null) {
                participations = participationService.getParticipationsBySemester(semesterId)
                        .stream()
                        .filter(p -> p.getPerson().getPersonId().equals(personId))
                        .collect(Collectors.toList());
            } else {
                participations = participationService.getParticipationsByPerson(personId);
            }

            List<Map<String, Object>> result = new ArrayList<>();
            for (Participation participation : participations) {
                Map<String, Object> data = new HashMap<>();
                data.put("participationId", participation.getParticipationId());
                data.put("semesterId", participation.getSemester().getSemesterId());
                data.put("semesterName", participation.getSemester().getName());
                data.put("groupId", participation.getGroup().getGroupId());
                data.put("groupName", participation.getGroup().getGroupName());
                data.put("status", participation.getStatus());
                data.put("participationDate", participation.getParticipationDate());

                // Get weekly record if exists
                Optional<WeeklyRecord> record = Optional.ofNullable(participation.getWeeklyRecord());
                if (record.isPresent()) {
                    WeeklyRecord wr = record.get();
                    Map<String, Object> recordData = new HashMap<>();
                    recordData.put("recordId", wr.getRecordId());
                    recordData.put("weekNumber", wr.getWeekNumber());
                    recordData.put("service1", wr.getService1());
                    recordData.put("service2", wr.getService2());
                    recordData.put("summary1", wr.getSummary1());
                    recordData.put("summary2", wr.getSummary2());
                    recordData.put("qt", wr.getQt());
                    recordData.put("reading", wr.getReading());
                    recordData.put("pray", wr.getPray());
                    recordData.put("memorize", wr.getMemorize());
                    recordData.put("submittedDate", wr.getSubmittedDate());
                    data.put("weeklyRecord", recordData);
                }

                result.add(data);
            }

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    @PutMapping("/participations/{participationId}/record")
    public ResponseEntity<?> updateWeeklyRecord(
            @PathVariable Integer participationId,
            @RequestBody WeeklyRecord weeklyRecordData) {
        try {
            // Get existing participation
            Participation participation = participationService.getParticipationById(participationId)
                    .orElseThrow(() -> new IllegalArgumentException("Participation not found"));

            WeeklyRecord weeklyRecord;
            if (participation.getWeeklyRecord() != null) {
                // Update existing record
                weeklyRecord = recordService.updateRecord(
                        participation.getWeeklyRecord().getRecordId(),
                        weeklyRecordData
                );
            } else {
                // Create new record
                weeklyRecord = recordService.createRecord(weeklyRecordData, participationId);
            }

            return ResponseEntity.ok(weeklyRecord);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
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