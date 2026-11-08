package com.saferoute.ai.service;

import com.saferoute.ai.dto.NotificationDto;
import com.saferoute.ai.entity.Notification;
import com.saferoute.ai.entity.User;
import com.saferoute.ai.repository.NotificationRepository;
import com.saferoute.ai.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    public List<NotificationDto> getUserNotifications(String email) {
        User user = getUserByEmail(email);
        return notificationRepository.findByUser_UserIdOrderByCreatedAtDesc(user.getUserId()).stream()
                .map(n -> NotificationDto.builder()
                        .notificationId(n.getNotificationId())
                        .title(n.getTitle())
                        .message(n.getMessage())
                        .type(n.getType())
                        .isRead(n.getIsRead())
                        .createdAt(n.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    public NotificationDto markAsRead(String email, Long notificationId) {
        User user = getUserByEmail(email);
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found"));

        if (!notification.getUser().getUserId().equals(user.getUserId())) {
            throw new IllegalArgumentException("Unauthorized action");
        }

        notification.setIsRead(true);
        Notification saved = notificationRepository.save(notification);

        return NotificationDto.builder()
                .notificationId(saved.getNotificationId())
                .title(saved.getTitle())
                .message(saved.getMessage())
                .type(saved.getType())
                .isRead(saved.getIsRead())
                .createdAt(saved.getCreatedAt())
                .build();
    }
}
