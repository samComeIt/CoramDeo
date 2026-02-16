package com.example.sample.repository;

import com.example.sample.model.WeeklyRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WeeklyRecordRepository extends JpaRepository<WeeklyRecord, Integer> {

    List<WeeklyRecord> findByParticipation_Person_PersonId(Integer personId);

    List<WeeklyRecord> findByParticipation_Semester_SemesterId(Integer semesterId);

    List<WeeklyRecord> findByParticipation_Person_PersonIdAndParticipation_Semester_SemesterId(Integer personId, Integer semesterId);
}