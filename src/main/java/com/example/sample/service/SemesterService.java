package com.example.sample.service;

import com.example.sample.model.Book;
import com.example.sample.model.Group;
import com.example.sample.model.Semester;
import com.example.sample.repository.BookRepository;
import com.example.sample.repository.GroupRepository;
import com.example.sample.repository.SemesterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@Transactional
public class SemesterService {

    private final SemesterRepository semesterRepository;
    private final GroupRepository groupRepository;
    private final BookRepository bookRepository;

    @Autowired
    public SemesterService(SemesterRepository semesterRepository,
                          GroupRepository groupRepository,
                          BookRepository bookRepository) {
        this.semesterRepository = semesterRepository;
        this.groupRepository = groupRepository;
        this.bookRepository = bookRepository;
    }

    public List<Semester> getAllSemesters() {
        return semesterRepository.findAll();
    }

    public Optional<Semester> getSemesterById(Integer id) {
        return semesterRepository.findById(id);
    }

    public Semester createSemester(Semester semester) {
        if (semester.getEdate().isBefore(semester.getSdate())) {
            throw new IllegalArgumentException("End date must be after start date");
        }
        return semesterRepository.save(semester);
    }

    public Semester updateSemester(Integer id, Semester semesterDetails) {
        Semester semester = semesterRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Semester not found with id: " + id));

        if (semesterDetails.getName() != null) {
            semester.setName(semesterDetails.getName());
        }

        if (semesterDetails.getSdate() != null) {
            semester.setSdate(semesterDetails.getSdate());
        }

        if (semesterDetails.getEdate() != null) {
            semester.setEdate(semesterDetails.getEdate());
        }

        semester.setBreak(semesterDetails.isBreak());

        if (semester.getEdate().isBefore(semester.getSdate())) {
            throw new IllegalArgumentException("End date must be after start date");
        }

        return semesterRepository.save(semester);
    }

    public void deleteSemester(Integer id) {
        if (!semesterRepository.existsById(id)) {
            throw new IllegalArgumentException("Semester not found with id: " + id);
        }
        semesterRepository.deleteById(id);
    }

    public Set<Group> getSemesterGroups(Integer semesterId) {
        Semester semester = semesterRepository.findById(semesterId)
                .orElseThrow(() -> new IllegalArgumentException("Semester not found with id: " + semesterId));
        return semester.getGroups();
    }

    public Semester addGroupToSemester(Integer semesterId, Integer groupId) {
        Semester semester = semesterRepository.findById(semesterId)
                .orElseThrow(() -> new IllegalArgumentException("Semester not found with id: " + semesterId));

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found with id: " + groupId));

        semester.getGroups().add(group);
        return semesterRepository.save(semester);
    }

    public Semester removeGroupFromSemester(Integer semesterId, Integer groupId) {
        Semester semester = semesterRepository.findById(semesterId)
                .orElseThrow(() -> new IllegalArgumentException("Semester not found with id: " + semesterId));

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found with id: " + groupId));

        if (!semester.getGroups().contains(group)) {
            throw new IllegalArgumentException("Group is not in this semester");
        }

        semester.getGroups().remove(group);
        return semesterRepository.save(semester);
    }

    public Set<Book> getSemesterBooks(Integer semesterId) {
        Semester semester = semesterRepository.findById(semesterId)
                .orElseThrow(() -> new IllegalArgumentException("Semester not found with id: " + semesterId));
        return semester.getBooks();
    }

    public Semester addBookToSemester(Integer semesterId, Integer bookId) {
        Semester semester = semesterRepository.findById(semesterId)
                .orElseThrow(() -> new IllegalArgumentException("Semester not found with id: " + semesterId));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("Book not found with id: " + bookId));

        semester.getBooks().add(book);
        return semesterRepository.save(semester);
    }

    public Semester removeBookFromSemester(Integer semesterId, Integer bookId) {
        Semester semester = semesterRepository.findById(semesterId)
                .orElseThrow(() -> new IllegalArgumentException("Semester not found with id: " + semesterId));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("Book not found with id: " + bookId));

        if (!semester.getBooks().contains(book)) {
            throw new IllegalArgumentException("Book is not in this semester");
        }

        semester.getBooks().remove(book);
        return semesterRepository.save(semester);
    }
}