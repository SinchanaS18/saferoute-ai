package com.saferoute.ai.entity;

import jakarta.persistence.*;
import lombok.*;
import org.locationtech.jts.geom.Point;
import java.time.LocalDateTime;

@Entity
@Table(name = "sos")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Sos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sos_id")
    private Long sosId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id")
    private Trip trip;

    @Column(name = "location_geom", nullable = false, columnDefinition = "geometry(Point,4326)")
    private Point locationGeom;

    @Builder.Default
    @Column(name = "status", length = 20)
    private String status = "ACTIVE";

    @Builder.Default
    @Column(name = "triggered_at")
    private LocalDateTime triggeredAt = LocalDateTime.now();

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;
}
