package com.saferoute.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RouteResponseDto {
    private String routeId;
    private String routeType; // SAFEST, BALANCED, SHORTEST
    private Double distanceKm;
    private Double durationMinutes;
    private Integer safetyScore; // 0 to 100
    private String riskLevel; // SAFE, MODERATE, HIGH_RISK
    private String explanation;
    private List<List<Double>> coordinates; // [[lat, lng], [lat, lng], ...]
    private Boolean isRecommended;
}
