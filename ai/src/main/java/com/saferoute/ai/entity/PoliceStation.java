package com.saferoute.ai.entity;

import jakarta.persistence.*;
import lombok.*;
import org.locationtech.jts.geom.Point;

@Entity
@Table(name = "police_stations")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PoliceStation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "station_id")
    private Long stationId;

    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @Column(name = "location_geom", nullable = false, columnDefinition = "geometry(Point,4326)")
    private Point locationGeom;

    @Column(name = "phone_number", length = 15)
    private String phoneNumber;

    @Column(name = "address")
    private String address;
}
