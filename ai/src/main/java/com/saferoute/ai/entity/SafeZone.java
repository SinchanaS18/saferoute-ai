package com.saferoute.ai.entity;

import jakarta.persistence.*;
import lombok.*;
import org.locationtech.jts.geom.Polygon;
import java.time.LocalDateTime;

@Entity
@Table(name = "safe_zones")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SafeZone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "zone_id")
    private Long zoneId;

    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @Column(name = "zone_geom", nullable = false, columnDefinition = "geometry(Polygon,4326)")
    private Polygon zoneGeom;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
