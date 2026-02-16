package com.example.sample.service;

import com.example.sample.model.Book;
import com.example.sample.model.Person;
import com.example.sample.model.Semester;
import com.example.sample.model.SemesterUserBook;
import com.example.sample.repository.BookRepository;
import com.example.sample.repository.PersonRepository;
import com.example.sample.repository.SemesterRepository;
import com.example.sample.repository.SemesterUserBookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class SemesterUserBookService {

    private final SemesterUserBookRepository semesterUserBookRepository;
    private final SemesterRepository semesterRepository;
    private final PersonRepository personRepository;
    private final BookRepository bookRepository;

    @Autowired
    public SemesterUserBookService(SemesterUserBookRepository semesterUserBookRepository,
                                   SemesterRepository semesterRepository,
                                   PersonRepository personRepository,
                                   BookRepository bookRepository) {
        this.semesterUserBookRepository = semesterUserBookRepository;
        this.semesterRepository = semesterRepository;
        this.personRepository = personRepository;
        this.bookRepository = bookRepository;
    }

    public List<SemesterUserBook> getAllSemesterUserBooks() {
        return semesterUserBookRepository.findAll();
    }

    public Optional<SemesterUserBook> getSemesterUserBookById(Integer id) {
        return semesterUserBookRepository.findById(id);
    }

    public List<SemesterUserBook> getSemesterUserBooksBySemester(Integer semesterId) {
        return semesterUserBookRepository.findBySemester_SemesterId(semesterId);
    }

    public List<SemesterUserBook> getSemesterUserBooksByPerson(Integer personId) {
        return semesterUserBookRepository.findByPerson_PersonId(personId);
    }

    public List<SemesterUserBook> getSemesterUserBooksByBook(Integer bookId) {
        return semesterUserBookRepository.findByBook_BookId(bookId);
    }

    public List<SemesterUserBook> getSemesterUserBooksBySemesterAndPerson(Integer semesterId, Integer personId) {
        return semesterUserBookRepository.findBySemester_SemesterIdAndPerson_PersonId(semesterId, personId);
    }

    public List<SemesterUserBook> getSemesterUserBooksBySemesterAndBook(Integer semesterId, Integer bookId) {
        return semesterUserBookRepository.findBySemester_SemesterIdAndBook_BookId(semesterId, bookId);
    }

    public SemesterUserBook createSemesterUserBook(Integer semesterId, Integer personId, Integer bookId, SemesterUserBook semesterUserBookData) {
        Semester semester = semesterRepository.findById(semesterId)
                .orElseThrow(() -> new IllegalArgumentException("Semester not found with id: " + semesterId));

        Person person = personRepository.findById(personId)
                .orElseThrow(() -> new IllegalArgumentException("Person not found with id: " + personId));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("Book not found with id: " + bookId));

        SemesterUserBook semesterUserBook = new SemesterUserBook();
        semesterUserBook.setSemester(semester);
        semesterUserBook.setPerson(person);
        semesterUserBook.setBook(book);
        semesterUserBook.setStatus(semesterUserBookData.getStatus());
        semesterUserBook.setDate(semesterUserBookData.getDate());

        return semesterUserBookRepository.save(semesterUserBook);
    }

    public SemesterUserBook updateSemesterUserBook(Integer id, SemesterUserBook semesterUserBookData) {
        SemesterUserBook semesterUserBook = semesterUserBookRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("SemesterUserBook not found with id: " + id));

        if (semesterUserBookData.getStatus() != null) {
            semesterUserBook.setStatus(semesterUserBookData.getStatus());
        }

        if (semesterUserBookData.getDate() != null) {
            semesterUserBook.setDate(semesterUserBookData.getDate());
        }

        return semesterUserBookRepository.save(semesterUserBook);
    }

    public void deleteSemesterUserBook(Integer id) {
        if (!semesterUserBookRepository.existsById(id)) {
            throw new IllegalArgumentException("SemesterUserBook not found with id: " + id);
        }
        semesterUserBookRepository.deleteById(id);
    }
}