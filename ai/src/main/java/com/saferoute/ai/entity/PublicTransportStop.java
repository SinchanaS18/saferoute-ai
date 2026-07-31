package com.saferoute.ai.entity;

import jakarta.persistence.*;
import lombok.*;
import org.locationtech.jts.geom.Point;

@Entity
@Table(name = "public_transport_stops")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PublicTransportStop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "stop_id")
    private Long stopId;

    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @Column(name = "stop_type", length = 30)
    private String stopType;

    @Column(name = "location_geom", nullable = false, columnDefinition = "geometry(Point,4326)")
    private Point locationGeom;
}
