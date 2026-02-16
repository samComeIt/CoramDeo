package com.example.sample.repository;

import com.example.sample.model.Participation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParticipationRepository extends JpaRepository<Participation, Integer> {

    List<Participation> findBySemester_SemesterId(Integer semesterId);

    List<Participation> findByGroup_GroupId(Integer groupId);

    List<Participation> findByPerson_PersonId(Integer personId);

    List<Participation> findBySemester_SemesterIdAndGroup_GroupIdAndPerson_PersonId(
        Integer semesterId, Integer groupId, Integer personId);
}