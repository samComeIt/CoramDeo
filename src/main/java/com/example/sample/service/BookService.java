package com.example.sample.service;

import com.example.sample.model.Book;
import com.example.sample.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class BookService {

    private final BookRepository bookRepository;

    @Autowired
    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    public Optional<Book> getBookById(Integer id) {
        return bookRepository.findById(id);
    }

    public Optional<Book> getBookByTitle(String title) {
        return bookRepository.findByTitle(title);
    }

    public List<Book> getBooksByAuthor(String author) {
        return bookRepository.findByAuthor(author);
    }

    public List<Book> searchBooksByTitle(String keyword) {
        return bookRepository.findByTitleContainingIgnoreCase(keyword);
    }

    public List<Book> searchBooksByAuthor(String keyword) {
        return bookRepository.findByAuthorContainingIgnoreCase(keyword);
    }

    public Book createBook(Book book) {
        if (book.getTitle() == null || book.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Book title is required");
        }
        if (book.getAuthor() == null || book.getAuthor().trim().isEmpty()) {
            throw new IllegalArgumentException("Book author is required");
        }
        return bookRepository.save(book);
    }

    public Book updateBook(Integer id, Book bookDetails) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Book not found with id: " + id));

        if (bookDetails.getTitle() != null && !bookDetails.getTitle().trim().isEmpty()) {
            book.setTitle(bookDetails.getTitle());
        }

        if (bookDetails.getAuthor() != null && !bookDetails.getAuthor().trim().isEmpty()) {
            book.setAuthor(bookDetails.getAuthor());
        }

        if (bookDetails.getDescription() != null) {
            book.setDescription(bookDetails.getDescription());
        }

        return bookRepository.save(book);
    }

    public void deleteBook(Integer id) {
        if (!bookRepository.existsById(id)) {
            throw new IllegalArgumentException("Book not found with id: " + id);
        }
        bookRepository.deleteById(id);
    }
}