package com.saferoute.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RouteRequestDto {
    private Double sourceLat;
    private Double sourceLng;
    private Double destinationLat;
    private Double destinationLng;
    private String preference; // SAFEST or SHORTEST
}
