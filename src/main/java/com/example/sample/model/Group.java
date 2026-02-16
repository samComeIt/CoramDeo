package com.example.sample.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "`groups`")
public class Group {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "group_id")
    private Integer groupId;

    @Column(name = "group_name", nullable = false)
    private String groupName;

    @ManyToMany
    @JoinTable(
        name = "group_member",
        joinColumns = @JoinColumn(name = "group_id"),
        inverseJoinColumns = @JoinColumn(name = "person_id")
    )
    @JsonIgnore
    private Set<Person> persons = new HashSet<>();

    @ManyToMany(mappedBy = "groups")
    @JsonIgnore
    private Set<Semester> semesters = new HashSet<>();

    public Group() {
    }

    public Group(String groupName) {
        this.groupName = groupName;
    }

    // Getters and Setters
    public Integer getGroupId() {
        return groupId;
    }

    public void setGroupId(Integer groupId) {
        this.groupId = groupId;
    }

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public Set<Person> getPersons() {
        return persons;
    }

    public void setPersons(Set<Person> persons) {
        this.persons = persons;
    }

    public Set<Semester> getSemesters() {
        return semesters;
    }

    public void setSemesters(Set<Semester> semesters) {
        this.semesters = semesters;
    }
}