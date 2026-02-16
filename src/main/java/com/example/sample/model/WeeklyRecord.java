package com.example.sample.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "weekly_records")
public class WeeklyRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "record_id")
    private Integer recordId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "participation_id", nullable = false)
    @JsonBackReference
    private Participation participation;

    @Column(name = "week_number", nullable = false)
    private Integer weekNumber;

    @Column(name = "service1", nullable = false)
    private String service1;

    @Column(name = "service2", nullable = false)
    private String service2;

    @Column(name = "summary1", nullable = false)
    private Boolean summary1 = false;

    @Column(name = "summary2", nullable = false)
    private Boolean summary2 = false;

    @Column(name = "qt", nullable = false)
    private Integer qt;

    @Column(name = "reading", nullable = false)
    private Integer reading;

    @Column(name = "pray", nullable = false)
    private Integer pray;

    @Column(name = "memorize", nullable = false)
    private Integer memorize;

    @Column(name = "submitted_date")
    private LocalDate submittedDate;

    public WeeklyRecord() {
    }

    public WeeklyRecord(Integer weekNumber, String service1, String service2, Boolean summary1, Boolean summary2,
                        Integer qt, Integer reading, Integer pray, Integer memorize) {
        this.weekNumber = weekNumber;
        this.service1 = service1;
        this.service2 = service2;
        this.summary1 = summary1;
        this.summary2 = summary2;
        this.qt = qt;
        this.reading = reading;
        this.pray = pray;
        this.memorize = memorize;
    }

    // Getters and Setters
    public Integer getRecordId() {
        return recordId;
    }

    public void setRecordId(Integer recordId) {
        this.recordId = recordId;
    }

    public Participation getParticipation() {
        return participation;
    }

    public void setParticipation(Participation participation) {
        this.participation = participation;
    }

    public Integer getWeekNumber() {
        return weekNumber;
    }

    public void setWeekNumber(Integer weekNumber) {
        this.weekNumber = weekNumber;
    }

    public String getService1() {
        return service1;
    }

    public void setService1(String service1) {
        this.service1 = service1;
    }

    public String getService2() {
        return service2;
    }

    public void setService2(String service2) {
        this.service2 = service2;
    }

    public Boolean getSummary1() {
        return summary1;
    }

    public void setSummary1(Boolean summary1) {
        this.summary1 = summary1;
    }

    public Boolean getSummary2() {
        return summary2;
    }

    public void setSummary2(Boolean summary2) {
        this.summary2 = summary2;
    }

    public Integer getQt() {
        return qt;
    }

    public void setQt(Integer qt) {
        this.qt = qt;
    }

    public Integer getReading() {
        return reading;
    }

    public void setReading(Integer reading) {
        this.reading = reading;
    }

    public Integer getPray() {
        return pray;
    }

    public void setPray(Integer pray) {
        this.pray = pray;
    }

    public Integer getMemorize() {
        return memorize;
    }

    public void setMemorize(Integer memorize) {
        this.memorize = memorize;
    }

    public LocalDate getSubmittedDate() {
        return submittedDate;
    }

    public void setSubmittedDate(LocalDate submittedDate) {
        this.submittedDate = submittedDate;
    }
}