package com.saferoute.ai.repository;

import com.saferoute.ai.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUser_UserIdOrderByCreatedAtDesc(Long userId);
    List<Notification> findByUser_UserIdAndIsReadFalse(Long userId);
}
