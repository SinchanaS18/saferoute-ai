package com.saferoute.ai.controller;

import com.saferoute.ai.dto.AdminDashboardDto;
import com.saferoute.ai.dto.UserProfileDto;
import com.saferoute.ai.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/stats")
    public ResponseEntity<AdminDashboardDto> getStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserProfileDto>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }
}
