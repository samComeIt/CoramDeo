package com.example.sample.controller;

import com.example.sample.model.Group;
import com.example.sample.model.Person;
import com.example.sample.service.GroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/admin/groups")
public class GroupController {

    private final GroupService groupService;

    @Autowired
    public GroupController(GroupService groupService) {
        this.groupService = groupService;
    }

    // Get all groups
    @GetMapping
    public ResponseEntity<List<Group>> getAllGroups() {
        List<Group> groups = groupService.getAllGroups();
        return ResponseEntity.ok(groups);
    }

    // Get group by id
    @GetMapping("/{id}")
    public ResponseEntity<?> getGroupById(@PathVariable Integer id) {
        return groupService.getGroupById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(createErrorResponse("Group not found with id: " + id)));
    }

    // Get group by name
    @GetMapping("/name/{groupName}")
    public ResponseEntity<?> getGroupByName(@PathVariable String groupName) {
        return groupService.getGroupByName(groupName)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(createErrorResponse("Group not found with name: " + groupName)));
    }

    // Create group
    @PostMapping
    public ResponseEntity<?> createGroup(@RequestBody Group group) {
        try {
            Group createdGroup = groupService.createGroup(group);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdGroup);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    // Update group
    @PutMapping("/{id}")
    public ResponseEntity<?> updateGroup(@PathVariable Integer id, @RequestBody Group groupDetails) {
        try {
            Group updatedGroup = groupService.updateGroup(id, groupDetails);
            return ResponseEntity.ok(updatedGroup);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    // Delete group
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteGroup(@PathVariable Integer id) {
        try {
            groupService.deleteGroup(id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Group deleted successfully");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    // Get all persons in a group
    @GetMapping("/{id}/persons")
    public ResponseEntity<?> getGroupMembers(@PathVariable Integer id) {
        try {
            Set<Person> persons = groupService.getGroupMembers(id);
            return ResponseEntity.ok(persons);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    // Add person to group (after group is created)
    @PostMapping("/{id}/persons")
    public ResponseEntity<?> addPersonToGroup(@PathVariable Integer id, @RequestParam Integer personId) {
        try {
            Group updatedGroup = groupService.addPersonToGroup(id, personId);
            return ResponseEntity.ok(updatedGroup);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    // Remove person from group
    @DeleteMapping("/{id}/persons/{personId}")
    public ResponseEntity<?> removePersonFromGroup(@PathVariable Integer id, @PathVariable Integer personId) {
        try {
            Group updatedGroup = groupService.removePersonFromGroup(id, personId);
            return ResponseEntity.ok(updatedGroup);
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