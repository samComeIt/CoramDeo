package com.example.sample.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "participations")
public class Participation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "participation_id")
    private Integer participationId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "semester_id", nullable = false)
    @JsonIgnoreProperties({"participations", "groups", "readingAssignments"})
    private Semester semester;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "group_id", nullable = false)
    @JsonIgnoreProperties({"persons", "semesters", "participations"})
    private Group group;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "person_id", nullable = false)
    @JsonIgnoreProperties({"groups", "participations", "password"})
    private Person person;

    @Column(nullable = false)
    private String status;

    @Column(name = "participation_date", nullable = false)
    private LocalDate participationDate;

    @OneToOne(mappedBy = "participation", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonManagedReference
    private WeeklyRecord weeklyRecord;

    public Participation() {
    }

    public Participation(String status) {
        this.status = status;
    }

    // Getters and Setters
    public Integer getParticipationId() {
        return participationId;
    }

    public void setParticipationId(Integer participationId) {
        this.participationId = participationId;
    }

    public Semester getSemester() {
        return semester;
    }

    public void setSemester(Semester semester) {
        this.semester = semester;
    }

    public Group getGroup() {
        return group;
    }

    public void setGroup(Group group) {
        this.group = group;
    }

    public Person getPerson() {
        return person;
    }

    public void setPerson(Person person) {
        this.person = person;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getParticipationDate() {
        return participationDate;
    }

    public void setParticipationDate(LocalDate participationDate) {
        this.participationDate = participationDate;
    }

    public WeeklyRecord getWeeklyRecord() {
        return weeklyRecord;
    }

    public void setWeeklyRecord(WeeklyRecord weeklyRecord) {
        this.weeklyRecord = weeklyRecord;
    }
}