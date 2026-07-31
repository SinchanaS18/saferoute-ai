package com.saferoute.ai.entity;

import jakarta.persistence.*;
import lombok.*;
import org.locationtech.jts.geom.Point;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Entity
@Table(name = "historical_crime_records")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class HistoricalCrimeRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "record_id")
    private Long recordId;

    @Column(name = "district", nullable = false, length = 50)
    private String district;

    @Column(name = "place_name", nullable = false, length = 150)
    private String placeName;

    @Column(name = "incident_type", nullable = false, length = 50)
    private String incidentType;

    @Column(name = "incident_date")
    private LocalDate incidentDate;

    @Column(name = "incident_time")
    private LocalTime incidentTime;

    @Column(name = "time_of_day", length = 20)
    private String timeOfDay;

    @Column(name = "victim_age")
    private Integer victimAge;

    @Column(name = "fir_section", length = 50)
    private String firSection;

    @Column(name = "case_status", length = 30)
    private String caseStatus;

    @Column(name = "data_source", length = 100)
    private String dataSource;

    @Column(name = "location_geom", nullable = false, columnDefinition = "geometry(Point,4326)")
    private Point locationGeom;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}