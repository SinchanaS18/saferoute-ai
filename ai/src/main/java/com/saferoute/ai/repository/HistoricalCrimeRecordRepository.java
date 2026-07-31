package com.saferoute.ai.repository;

import com.saferoute.ai.entity.HistoricalCrimeRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HistoricalCrimeRecordRepository extends JpaRepository<HistoricalCrimeRecord, Long> {
    List<HistoricalCrimeRecord> findByDistrict(String district);
    List<HistoricalCrimeRecord> findByIncidentType(String incidentType);
}