package com.saferoute.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SafeZoneDto {
    private Long zoneId;
    private String name;
    private String description;
    private Double centerLat;
    private Double centerLng;
    private Double radiusMeters;
}
