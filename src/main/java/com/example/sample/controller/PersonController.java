package com.example.sample.controller;

import com.example.sample.model.Person;
import com.example.sample.service.PersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/persons")
public class PersonController {

    private final PersonService personService;

    @Autowired
    public PersonController(PersonService personService) {
        this.personService = personService;
    }

    // View all persons
    @GetMapping
    public ResponseEntity<List<Person>> getAllPersons() {
        List<Person> persons = personService.getAllPersons();
        return ResponseEntity.ok(persons);
    }

    // View person by id
    @GetMapping("/{id}")
    public ResponseEntity<?> getPersonById(@PathVariable Integer id) {
        return personService.getPersonById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(createErrorResponse("Person not found with id: " + id)));
    }

    // Insert (create) person
    @PostMapping
    public ResponseEntity<?> createPerson(@RequestBody Person person) {
        try {
            Person createdPerson = personService.createPerson(person);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdPerson);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    // Update person
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePerson(@PathVariable Integer id, @RequestBody Person personDetails) {
        try {
            Person updatedPerson = personService.updatePerson(id, personDetails);
            return ResponseEntity.ok(updatedPerson);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse(e.getMessage()));
        }
    }

    // Delete person
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePerson(@PathVariable Integer id) {
        try {
            personService.deletePerson(id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Person deleted successfully");
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