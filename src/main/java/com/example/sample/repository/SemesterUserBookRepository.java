package com.example.sample.repository;

import com.example.sample.model.SemesterUserBook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SemesterUserBookRepository extends JpaRepository<SemesterUserBook, Integer> {

    List<SemesterUserBook> findBySemester_SemesterId(Integer semesterId);

    List<SemesterUserBook> findByPerson_PersonId(Integer personId);

    List<SemesterUserBook> findByBook_BookId(Integer bookId);

    List<SemesterUserBook> findBySemester_SemesterIdAndPerson_PersonId(Integer semesterId, Integer personId);

    List<SemesterUserBook> findBySemester_SemesterIdAndBook_BookId(Integer semesterId, Integer bookId);
}