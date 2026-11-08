package com.saferoute.ai.controller;

import com.saferoute.ai.dto.NotificationDto;
import com.saferoute.ai.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<NotificationDto>> getNotifications(@AuthenticationPrincipal String email) {
        return ResponseEntity.ok(notificationService.getUserNotifications(email));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<NotificationDto> markAsRead(@AuthenticationPrincipal String email,
                                                      @PathVariable Long id) {
        return ResponseEntity.ok(notificationService.markAsRead(email, id));
    }
}
