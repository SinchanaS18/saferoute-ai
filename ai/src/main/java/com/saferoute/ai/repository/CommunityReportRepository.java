package com.saferoute.ai.repository;

import com.saferoute.ai.entity.CommunityReport;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommunityReportRepository extends JpaRepository<CommunityReport, Long> {
    List<CommunityReport> findByUser_UserId(Long userId);
    List<CommunityReport> findByStatus(String status);
}
