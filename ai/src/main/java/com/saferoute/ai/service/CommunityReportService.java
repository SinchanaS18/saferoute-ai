package com.saferoute.ai.service;

import com.saferoute.ai.dto.CommunityReportDto;
import com.saferoute.ai.entity.CommunityReport;
import com.saferoute.ai.entity.User;
import com.saferoute.ai.repository.CommunityReportRepository;
import com.saferoute.ai.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommunityReportService {

    private final CommunityReportRepository reportRepository;
    private final UserRepository userRepository;
    private final GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    public CommunityReportDto createReport(String email, CommunityReportDto dto) {
        User user = getUserByEmail(email);

        org.locationtech.jts.geom.Point point = geometryFactory.createPoint(
                new Coordinate(dto.getLongitude(), dto.getLatitude())
        );

        CommunityReport report = CommunityReport.builder()
                .user(user)
                .category(dto.getCategory())
                .description(dto.getDescription())
                .locationGeom(point)
                .address(dto.getAddress() != null ? dto.getAddress() : "Reported Location")
                .status("APPROVED") // Auto approve for quick demo
                .createdAt(LocalDateTime.now())
                .build();

        CommunityReport saved = reportRepository.save(report);
        return mapToDto(saved);
    }

    public List<CommunityReportDto> getAllReports() {
        return reportRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public CommunityReportDto getReportById(Long id) {
        CommunityReport report = reportRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Report not found"));
        return mapToDto(report);
    }

    public CommunityReportDto updateReportStatus(Long id, String status) {
        CommunityReport report = reportRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Report not found"));
        report.setStatus(status);
        return mapToDto(reportRepository.save(report));
    }

    public void deleteReport(Long id) {
        reportRepository.deleteById(id);
    }

    private CommunityReportDto mapToDto(CommunityReport report) {
        double lat = report.getLocationGeom() != null ? report.getLocationGeom().getY() : 0.0;
        double lng = report.getLocationGeom() != null ? report.getLocationGeom().getX() : 0.0;

        return CommunityReportDto.builder()
                .reportId(report.getReportId())
                .userId(report.getUser() != null ? report.getUser().getUserId() : null)
                .userName(report.getUser() != null ? report.getUser().getFullName() : "Anonymous")
                .category(report.getCategory())
                .description(report.getDescription())
                .latitude(lat)
                .longitude(lng)
                .address(report.getAddress())
                .status(report.getStatus())
                .createdAt(report.getCreatedAt())
                .build();
    }
}
