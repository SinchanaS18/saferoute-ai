package com.saferoute.ai.service;

import com.saferoute.ai.dto.AdminDashboardDto;
import com.saferoute.ai.dto.CommunityReportDto;
import com.saferoute.ai.dto.SosResponseDto;
import com.saferoute.ai.dto.UserProfileDto;
import com.saferoute.ai.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final SosRepository sosRepository;
    private final CommunityReportRepository reportRepository;
    private final SafeZoneRepository safeZoneRepository;
    private final HistoricalCrimeRecordRepository crimeRecordRepository;

    public AdminDashboardDto getDashboardStats() {
        long totalUsers = userRepository.count();
        long activeSos = sosRepository.findAll().stream().filter(s -> "ACTIVE".equals(s.getStatus())).count();
        long totalReports = reportRepository.count();
        long safeZones = safeZoneRepository.count();
        long crimeRecords = crimeRecordRepository.count();

        List<UserProfileDto> recentUsers = userRepository.findAll().stream()
                .limit(5)
                .map(u -> UserProfileDto.builder()
                        .userId(u.getUserId())
                        .fullName(u.getFullName())
                        .email(u.getEmail())
                        .phoneNumber(u.getPhoneNumber())
                        .gender(u.getGender())
                        .role(u.getRole() != null ? u.getRole().getRoleName() : "TRAVELER")
                        .build())
                .collect(Collectors.toList());

        List<SosResponseDto> recentSos = sosRepository.findAll().stream()
                .limit(5)
                .map(s -> SosResponseDto.builder()
                        .sosId(s.getSosId())
                        .userId(s.getUser().getUserId())
                        .userName(s.getUser().getFullName())
                        .status(s.getStatus())
                        .triggeredAt(s.getTriggeredAt())
                        .latitude(s.getLocationGeom() != null ? s.getLocationGeom().getY() : 0.0)
                        .longitude(s.getLocationGeom() != null ? s.getLocationGeom().getX() : 0.0)
                        .build())
                .collect(Collectors.toList());

        List<CommunityReportDto> recentReports = reportRepository.findAll().stream()
                .limit(5)
                .map(r -> CommunityReportDto.builder()
                        .reportId(r.getReportId())
                        .category(r.getCategory())
                        .description(r.getDescription())
                        .status(r.getStatus())
                        .createdAt(r.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        return AdminDashboardDto.builder()
                .totalUsers(totalUsers)
                .activeSosAlerts(activeSos)
                .totalCommunityReports(totalReports)
                .totalSafeZones(safeZones)
                .historicalCrimeRecordsCount(crimeRecords)
                .recentUsers(recentUsers)
                .recentSosAlerts(recentSos)
                .recentReports(recentReports)
                .build();
    }

    public List<UserProfileDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(u -> UserProfileDto.builder()
                        .userId(u.getUserId())
                        .fullName(u.getFullName())
                        .email(u.getEmail())
                        .phoneNumber(u.getPhoneNumber())
                        .gender(u.getGender())
                        .role(u.getRole() != null ? u.getRole().getRoleName() : "TRAVELER")
                        .build())
                .collect(Collectors.toList());
    }
}
