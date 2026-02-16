package com.example.sample.service;

import com.example.sample.model.Person;
import com.example.sample.repository.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PersonService {

    private final PersonRepository personRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public PersonService(PersonRepository personRepository, PasswordEncoder passwordEncoder) {
        this.personRepository = personRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Person> getAllPersons() {
        return personRepository.findAll();
    }

    public Optional<Person> getPersonById(Integer id) {
        return personRepository.findById(id);
    }

    public Person createPerson(Person person) {
        // Encrypt password before saving
        if (person.getPassword() != null && !person.getPassword().isEmpty()) {
            person.setPassword(passwordEncoder.encode(person.getPassword()));
        }
        return personRepository.save(person);
    }

    public Person updatePerson(Integer id, Person personDetails) {
        Person person = personRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Person not found with id: " + id));

        if (personDetails.getName() != null) {
            person.setName(personDetails.getName());
        }

        if (personDetails.getPassword() != null && !personDetails.getPassword().isEmpty()) {
            // Encrypt password before updating
            person.setPassword(passwordEncoder.encode(personDetails.getPassword()));
        }

        return personRepository.save(person);
    }

    public void deletePerson(Integer id) {
        if (!personRepository.existsById(id)) {
            throw new IllegalArgumentException("Person not found with id: " + id);
        }
        personRepository.deleteById(id);
    }

    public Person authenticate(String name, String password) {
        List<Person> persons = personRepository.findAll();
        Person person = persons.stream()
                .filter(p -> p.getName().equals(name))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Invalid name or password"));

        if (!passwordEncoder.matches(password, person.getPassword())) {
            throw new IllegalArgumentException("Invalid name or password");
        }

        return person;
    }

    public Person findByName(String name) {
        return personRepository.findAll().stream()
                .filter(p -> p.getName().equals(name))
                .findFirst()
                .orElse(null);
    }
}