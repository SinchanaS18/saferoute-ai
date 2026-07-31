package com.saferoute.ai.repository;

import com.saferoute.ai.entity.AdminLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AdminLogRepository extends JpaRepository<AdminLog, Long> {
    List<AdminLog> findByAdmin_UserId(Long adminId);
}
