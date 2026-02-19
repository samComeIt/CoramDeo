package com.example.sample.repository;

import com.example.sample.model.Participation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParticipationRepository extends JpaRepository<Participation, Integer>,
                                                  JpaSpecificationExecutor<Participation> {

    List<Participation> findBySemester_SemesterId(Integer semesterId);

    List<Participation> findByGroup_GroupId(Integer groupId);

    List<Participation> findByPerson_PersonId(Integer personId);

    List<Participation> findBySemester_SemesterIdAndGroup_GroupIdAndPerson_PersonId(
        Integer semesterId, Integer groupId, Integer personId);

    // Pagination methods
    Page<Participation> findBySemester_SemesterId(Integer semesterId, Pageable pageable);

    Page<Participation> findByGroup_GroupId(Integer groupId, Pageable pageable);

    Page<Participation> findByPerson_PersonId(Integer personId, Pageable pageable);

    Page<Participation> findByStatus(String status, Pageable pageable);
}