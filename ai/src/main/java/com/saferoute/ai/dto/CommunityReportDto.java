package com.saferoute.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommunityReportDto {
    private Long reportId;
    private Long userId;
    private String userName;
    private String category; // e.g. POOR_LIGHTING, HARASSMENT, UNCHAINED_DOGS, SUSPICIOUS_ACTIVITY, ISOLATED_AREA
    private String description;
    private Double latitude;
    private Double longitude;
    private String address;
    private String status; // PENDING, APPROVED, RESOLVED, REJECTED
    private LocalDateTime createdAt;
}
