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
public class AdminDashboardDto {
    private Long totalUsers;
    private Long activeSosAlerts;
    private Long totalCommunityReports;
    private Long totalSafeZones;
    private Long historicalCrimeRecordsCount;
    private List<UserProfileDto> recentUsers;
    private List<SosResponseDto> recentSosAlerts;
    private List<CommunityReportDto> recentReports;
}
