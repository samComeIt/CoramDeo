package com.example.sample.repository;

import com.example.sample.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Integer> {

    Optional<Book> findByTitle(String title);

    List<Book> findByAuthor(String author);

    List<Book> findByTitleContainingIgnoreCase(String keyword);

    List<Book> findByAuthorContainingIgnoreCase(String keyword);
}