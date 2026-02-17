package com.example.sample.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "semesters")
public class Semester {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "semester_id")
    private Integer semesterId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private LocalDate sdate;

    @Column(nullable = false)
    private LocalDate edate;

    @Column(nullable = false)
    @JsonProperty("isBreak")
    private boolean isBreak = false;

    @ManyToMany
    @JoinTable(
        name = "semester_group",
        joinColumns = @JoinColumn(name = "semester_id"),
        inverseJoinColumns = @JoinColumn(name = "group_id")
    )
    @JsonIgnore
    private Set<Group> groups = new HashSet<>();

    @ManyToMany
    @JoinTable(
        name = "semester_book",
        joinColumns = @JoinColumn(name = "semester_id"),
        inverseJoinColumns = @JoinColumn(name = "book_id")
    )
    @JsonIgnore
    private Set<Book> books = new HashSet<>();

    public Semester() {
    }

    public Semester(String name, LocalDate sdate, LocalDate edate) {
        this.name = name;
        this.sdate = sdate;
        this.edate = edate;
        this.isBreak = false;
    }

    // Getters and Setters
    public Integer getSemesterId() {
        return semesterId;
    }

    public void setSemesterId(Integer semesterId) {
        this.semesterId = semesterId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDate getSdate() {
        return sdate;
    }

    public void setSdate(LocalDate sdate) {
        this.sdate = sdate;
    }

    public LocalDate getEdate() {
        return edate;
    }

    public void setEdate(LocalDate edate) {
        this.edate = edate;
    }

    public boolean isBreak() {
        return isBreak;
    }

    public void setBreak(boolean isBreak) {
        this.isBreak = isBreak;
    }

    public Set<Group> getGroups() {
        return groups;
    }

    public void setGroups(Set<Group> groups) {
        this.groups = groups;
    }

    public Set<Book> getBooks() {
        return books;
    }

    public void setBooks(Set<Book> books) {
        this.books = books;
    }
}