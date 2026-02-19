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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
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

    // Pagination methods
    public Page<Participation> getAllParticipationsPaginated(Pageable pageable) {
        return participationRepository.findAll(pageable);
    }

    public Page<Participation> getParticipationsBySemesterPaginated(Integer semesterId, Pageable pageable) {
        return participationRepository.findBySemester_SemesterId(semesterId, pageable);
    }

    public Page<Participation> getParticipationsByGroupPaginated(Integer groupId, Pageable pageable) {
        return participationRepository.findByGroup_GroupId(groupId, pageable);
    }

    public Page<Participation> getParticipationsByPersonPaginated(Integer personId, Pageable pageable) {
        return participationRepository.findByPerson_PersonId(personId, pageable);
    }

    public Page<Participation> searchParticipations(Integer semesterId, Integer groupId, Integer personId,
                                                     String status, LocalDate startDate, LocalDate endDate,
                                                     Pageable pageable) {
        Specification<Participation> spec = Specification.where(null);

        if (semesterId != null) {
            spec = spec.and((root, query, cb) ->
                cb.equal(root.get("semester").get("semesterId"), semesterId));
        }
        if (groupId != null) {
            spec = spec.and((root, query, cb) ->
                cb.equal(root.get("group").get("groupId"), groupId));
        }
        if (personId != null) {
            spec = spec.and((root, query, cb) ->
                cb.equal(root.get("person").get("personId"), personId));
        }
        if (status != null && !status.isEmpty()) {
            spec = spec.and((root, query, cb) ->
                cb.equal(cb.lower(root.get("status")), status.toLowerCase()));
        }
        if (startDate != null) {
            spec = spec.and((root, query, cb) ->
                cb.greaterThanOrEqualTo(root.get("participationDate"), startDate));
        }
        if (endDate != null) {
            spec = spec.and((root, query, cb) ->
                cb.lessThanOrEqualTo(root.get("participationDate"), endDate));
        }

        return participationRepository.findAll(spec, pageable);
    }
}