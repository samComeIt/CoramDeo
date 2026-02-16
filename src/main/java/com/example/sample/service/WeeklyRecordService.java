package com.example.sample.service;

import com.example.sample.model.Participation;
import com.example.sample.model.WeeklyRecord;
import com.example.sample.repository.ParticipationRepository;
import com.example.sample.repository.WeeklyRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class WeeklyRecordService {

    private final WeeklyRecordRepository recordRepository;
    private final ParticipationRepository participationRepository;

    @Autowired
    public WeeklyRecordService(WeeklyRecordRepository recordRepository,
                              ParticipationRepository participationRepository) {
        this.recordRepository = recordRepository;
        this.participationRepository = participationRepository;
    }

    public List<WeeklyRecord> getAllRecords() {
        return recordRepository.findAll();
    }

    public Optional<WeeklyRecord> getRecordById(Integer id) {
        return recordRepository.findById(id);
    }

    public List<WeeklyRecord> getRecordsByPersonId(Integer personId) {
        return recordRepository.findByParticipation_Person_PersonId(personId);
    }

    public List<WeeklyRecord> getRecordsBySemesterId(Integer semesterId) {
        return recordRepository.findByParticipation_Semester_SemesterId(semesterId);
    }

    public List<WeeklyRecord> getRecordsByPersonAndSemester(Integer personId, Integer semesterId) {
        return recordRepository.findByParticipation_Person_PersonIdAndParticipation_Semester_SemesterId(personId, semesterId);
    }

    public WeeklyRecord createRecord(WeeklyRecord record, Integer participationId) {
        Participation participation = participationRepository.findById(participationId)
                .orElseThrow(() -> new IllegalArgumentException("Participation not found with id: " + participationId));

        validateService(record.getService1(), "Service1");
        validateService(record.getService2(), "Service2");

        if (record.getQt() < 0 || record.getQt() > 6) {
            throw new IllegalArgumentException("QT must be between 0 and 6");
        }

        if (record.getReading() < 0 || record.getReading() > 35) {
            throw new IllegalArgumentException("Reading must be between 0 and 35");
        }

        if (record.getPray() < 0 || record.getPray() > 7) {
            throw new IllegalArgumentException("Pray must be between 0 and 7");
        }

        if (record.getMemorize() < 0 || record.getMemorize() > 4) {
            throw new IllegalArgumentException("Memorize must be between 0 and 4");
        }

        record.setParticipation(participation);
        return recordRepository.save(record);
    }

    private void validateService(String service, String fieldName) {
        if (service == null || (!service.equalsIgnoreCase("ontime") &&
                                !service.equalsIgnoreCase("late") &&
                                !service.equalsIgnoreCase("absent"))) {
            throw new IllegalArgumentException(fieldName + " must be 'ontime', 'late', or 'absent'");
        }
    }

    public WeeklyRecord updateRecord(Integer id, WeeklyRecord recordDetails) {
        WeeklyRecord record = recordRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Record not found with id: " + id));

        if (recordDetails.getWeekNumber() != null) {
            record.setWeekNumber(recordDetails.getWeekNumber());
        }

        if (recordDetails.getService1() != null) {
            validateService(recordDetails.getService1(), "Service1");
            record.setService1(recordDetails.getService1());
        }

        if (recordDetails.getService2() != null) {
            validateService(recordDetails.getService2(), "Service2");
            record.setService2(recordDetails.getService2());
        }

        if (recordDetails.getSummary1() != null) {
            record.setSummary1(recordDetails.getSummary1());
        }

        if (recordDetails.getSummary2() != null) {
            record.setSummary2(recordDetails.getSummary2());
        }

        if (recordDetails.getQt() != null) {
            if (recordDetails.getQt() < 0 || recordDetails.getQt() > 6) {
                throw new IllegalArgumentException("QT must be between 0 and 6");
            }
            record.setQt(recordDetails.getQt());
        }

        if (recordDetails.getReading() != null) {
            if (recordDetails.getReading() < 0 || recordDetails.getReading() > 35) {
                throw new IllegalArgumentException("Reading must be between 0 and 35");
            }
            record.setReading(recordDetails.getReading());
        }

        if (recordDetails.getPray() != null) {
            if (recordDetails.getPray() < 0 || recordDetails.getPray() > 7) {
                throw new IllegalArgumentException("Pray must be between 0 and 7");
            }
            record.setPray(recordDetails.getPray());
        }

        if (recordDetails.getMemorize() != null) {
            if (recordDetails.getMemorize() < 0 || recordDetails.getMemorize() > 4) {
                throw new IllegalArgumentException("Memorize must be between 0 and 4");
            }
            record.setMemorize(recordDetails.getMemorize());
        }

        if (recordDetails.getSubmittedDate() != null) {
            record.setSubmittedDate(recordDetails.getSubmittedDate());
        }

        return recordRepository.save(record);
    }

    public void deleteRecord(Integer id) {
        if (!recordRepository.existsById(id)) {
            throw new IllegalArgumentException("Record not found with id: " + id);
        }
        recordRepository.deleteById(id);
    }
}