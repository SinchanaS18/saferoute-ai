package com.saferoute.ai.entity;

import jakarta.persistence.*;
import lombok.*;
import org.locationtech.jts.geom.Point;
import java.time.LocalDateTime;

@Entity
@Table(name = "community_reports")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CommunityReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "report_id")
    private Long reportId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "category", nullable = false, length = 30)
    private String category;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "location_geom", nullable = false, columnDefinition = "geometry(Point,4326)")
    private Point locationGeom;

    @Column(name = "address")
    private String address;

    @Builder.Default
    @Column(name = "status", length = 20)
    private String status = "PENDING";

    @Builder.Default
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
