package com.saferoute.ai.controller;

import com.saferoute.ai.dto.CommunityReportDto;
import com.saferoute.ai.service.CommunityReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class CommunityReportController {

    private final CommunityReportService reportService;

    @PostMapping
    public ResponseEntity<CommunityReportDto> createReport(@AuthenticationPrincipal String email,
                                                            @RequestBody CommunityReportDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(reportService.createReport(email, dto));
    }

    @GetMapping
    public ResponseEntity<List<CommunityReportDto>> getAllReports() {
        return ResponseEntity.ok(reportService.getAllReports());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CommunityReportDto> getReportById(@PathVariable Long id) {
        return ResponseEntity.ok(reportService.getReportById(id));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<CommunityReportDto> updateStatus(@PathVariable Long id,
                                                           @RequestBody Map<String, String> payload) {
        String status = payload.getOrDefault("status", "APPROVED");
        return ResponseEntity.ok(reportService.updateReportStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReport(@PathVariable Long id) {
        reportService.deleteReport(id);
        return ResponseEntity.noContent().build();
    }
}
