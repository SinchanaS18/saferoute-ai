package com.saferoute.ai.entity;

import jakarta.persistence.*;
import lombok.*;
import org.locationtech.jts.geom.LineString;
import java.time.LocalDateTime;

@Entity
@Table(name = "routes")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Route {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "route_id")
    private Long routeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    @Column(name = "route_type", nullable = false, length = 20)
    private String routeType;

    @Column(name = "distance_km", nullable = false)
    private Double distanceKm;

    @Column(name = "duration_minutes", nullable = false)
    private Double durationMinutes;

    @Column(name = "route_geom", columnDefinition = "geometry(LineString,4326)")
    private LineString routeGeom;

    @Column(name = "is_selected")
    private Boolean isSelected = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}