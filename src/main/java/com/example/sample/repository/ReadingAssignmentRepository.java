package com.example.sample.repository;

import com.example.sample.model.ReadingAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReadingAssignmentRepository extends JpaRepository<ReadingAssignment, Integer> {

    List<ReadingAssignment> findBySemesterSemesterId(Integer semesterId);
}