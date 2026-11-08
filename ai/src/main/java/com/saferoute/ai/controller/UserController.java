package com.saferoute.ai.controller;

import com.saferoute.ai.dto.UserPreferenceDto;
import com.saferoute.ai.dto.UserProfileDto;
import com.saferoute.ai.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserProfileDto> getMyProfile(@AuthenticationPrincipal String email) {
        return ResponseEntity.ok(userService.getProfile(email));
    }

    @PutMapping("/me")
    public ResponseEntity<UserProfileDto> updateMyProfile(@AuthenticationPrincipal String email,
                                                           @RequestBody UserProfileDto request) {
        return ResponseEntity.ok(userService.updateProfile(email, request));
    }

    @GetMapping("/me/preferences")
    public ResponseEntity<UserPreferenceDto> getMyPreferences(@AuthenticationPrincipal String email) {
        return ResponseEntity.ok(userService.getPreferences(email));
    }

    @PutMapping("/me/preferences")
    public ResponseEntity<UserPreferenceDto> updateMyPreferences(@AuthenticationPrincipal String email,
                                                                 @RequestBody UserPreferenceDto request) {
        return ResponseEntity.ok(userService.updatePreferences(email, request));
    }
}
