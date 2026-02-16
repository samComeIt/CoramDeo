package com.example.sample.service;

import com.example.sample.model.ReadingAssignment;
import com.example.sample.model.Semester;
import com.example.sample.repository.ReadingAssignmentRepository;
import com.example.sample.repository.SemesterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ReadingAssignmentService {

    private final ReadingAssignmentRepository assignmentRepository;
    private final SemesterRepository semesterRepository;

    @Autowired
    public ReadingAssignmentService(ReadingAssignmentRepository assignmentRepository,
                                   SemesterRepository semesterRepository) {
        this.assignmentRepository = assignmentRepository;
        this.semesterRepository = semesterRepository;
    }

    public List<ReadingAssignment> getAllAssignments() {
        return assignmentRepository.findAll();
    }

    public Optional<ReadingAssignment> getAssignmentById(Integer id) {
        return assignmentRepository.findById(id);
    }

    public List<ReadingAssignment> getAssignmentsBySemesterId(Integer semesterId) {
        return assignmentRepository.findBySemesterSemesterId(semesterId);
    }

    public ReadingAssignment createAssignment(ReadingAssignment assignment, Integer semesterId) {
        Semester semester = semesterRepository.findById(semesterId)
                .orElseThrow(() -> new IllegalArgumentException("Semester not found with id: " + semesterId));

        assignment.setSemester(semester);
        return assignmentRepository.save(assignment);
    }

    public ReadingAssignment updateAssignment(Integer id, ReadingAssignment assignmentDetails) {
        ReadingAssignment assignment = assignmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Assignment not found with id: " + id));

        if (assignmentDetails.getTitle() != null) {
            assignment.setTitle(assignmentDetails.getTitle());
        }

        if (assignmentDetails.getDescription() != null) {
            assignment.setDescription(assignmentDetails.getDescription());
        }

        if (assignmentDetails.getAssignedDate() != null) {
            assignment.setAssignedDate(assignmentDetails.getAssignedDate());
        }

        return assignmentRepository.save(assignment);
    }

    public void deleteAssignment(Integer id) {
        if (!assignmentRepository.existsById(id)) {
            throw new IllegalArgumentException("Assignment not found with id: " + id);
        }
        assignmentRepository.deleteById(id);
    }
}