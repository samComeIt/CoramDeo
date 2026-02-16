package com.example.sample.service;

import com.example.sample.model.Group;
import com.example.sample.model.Participation;
import com.example.sample.model.Person;
import com.example.sample.model.Semester;
import com.example.sample.repository.GroupRepository;
import com.example.sample.repository.ParticipationRepository;
import com.example.sample.repository.PersonRepository;
import com.example.sample.repository.SemesterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ParticipationService {

    private final ParticipationRepository participationRepository;
    private final SemesterRepository semesterRepository;
    private final GroupRepository groupRepository;
    private final PersonRepository personRepository;

    @Autowired
    public ParticipationService(ParticipationRepository participationRepository,
                               SemesterRepository semesterRepository,
                               GroupRepository groupRepository,
                               PersonRepository personRepository) {
        this.participationRepository = participationRepository;
        this.semesterRepository = semesterRepository;
        this.groupRepository = groupRepository;
        this.personRepository = personRepository;
    }

    public List<Participation> getAllParticipations() {
        return participationRepository.findAll();
    }

    public Optional<Participation> getParticipationById(Integer id) {
        return participationRepository.findById(id);
    }

    public List<Participation> getParticipationsBySemester(Integer semesterId) {
        return participationRepository.findBySemester_SemesterId(semesterId);
    }

    public List<Participation> getParticipationsByGroup(Integer groupId) {
        return participationRepository.findByGroup_GroupId(groupId);
    }

    public List<Participation> getParticipationsByPerson(Integer personId) {
        return participationRepository.findByPerson_PersonId(personId);
    }

    public Participation createParticipation(Participation participation,
                                            Integer semesterId,
                                            Integer groupId,
                                            Integer personId) {
        Semester semester = semesterRepository.findById(semesterId)
                .orElseThrow(() -> new IllegalArgumentException("Semester not found with id: " + semesterId));

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found with id: " + groupId));

        Person person = personRepository.findById(personId)
                .orElseThrow(() -> new IllegalArgumentException("Person not found with id: " + personId));

        String status = participation.getStatus().toLowerCase();
        if (!status.equals("ontime") && !status.equals("late") && !status.equals("absent")) {
            throw new IllegalArgumentException("Status must be 'ontime', 'late', or 'absent'");
        }

        if (participation.getParticipationDate() == null) {
            throw new IllegalArgumentException("Participation date is required");
        }

        participation.setSemester(semester);
        participation.setGroup(group);
        participation.setPerson(person);
        return participationRepository.save(participation);
    }

    public Participation updateParticipation(Integer id, Participation participationDetails) {
        Participation participation = participationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Participation not found with id: " + id));

        if (participationDetails.getStatus() != null) {
            String status = participationDetails.getStatus().toLowerCase();
            if (!status.equals("ontime") && !status.equals("late") && !status.equals("absent")) {
                throw new IllegalArgumentException("Status must be 'ontime', 'late', or 'absent'");
            }
            participation.setStatus(participationDetails.getStatus());
        }

        if (participationDetails.getParticipationDate() != null) {
            participation.setParticipationDate(participationDetails.getParticipationDate());
        }

        return participationRepository.save(participation);
    }

    public void deleteParticipation(Integer id) {
        if (!participationRepository.existsById(id)) {
            throw new IllegalArgumentException("Participation not found with id: " + id);
        }
        participationRepository.deleteById(id);
    }
}