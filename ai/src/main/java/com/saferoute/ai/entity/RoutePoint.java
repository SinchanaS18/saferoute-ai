package com.saferoute.ai.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "route_points")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RoutePoint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "point_id")
    private Long pointId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "route_id", nullable = false)
    private Route route;

    @Column(name = "sequence_number", nullable = false)
    private Integer sequenceNumber;

    @Column(name = "latitude", nullable = false)
    private Double latitude;

    @Column(name = "longitude", nullable = false)
    private Double longitude;

    @Column(name = "instruction")
    private String instruction;
}