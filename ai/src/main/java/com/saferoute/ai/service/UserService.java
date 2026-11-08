package com.saferoute.ai.service;

import com.saferoute.ai.dto.UserPreferenceDto;
import com.saferoute.ai.dto.UserProfileDto;
import com.saferoute.ai.entity.User;
import com.saferoute.ai.entity.UserPreference;
import com.saferoute.ai.repository.UserPreferenceRepository;
import com.saferoute.ai.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserPreferenceRepository userPreferenceRepository;

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));
    }

    public UserProfileDto getProfile(String email) {
        User user = getUserByEmail(email);
        return UserProfileDto.builder()
                .userId(user.getUserId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .gender(user.getGender())
                .role(user.getRole() != null ? user.getRole().getRoleName() : "TRAVELER")
                .build();
    }

    public UserProfileDto updateProfile(String email, UserProfileDto request) {
        User user = getUserByEmail(email);
        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getPhoneNumber() != null) user.setPhoneNumber(request.getPhoneNumber());
        if (request.getGender() != null) user.setGender(request.getGender());
        User updated = userRepository.save(user);

        return getProfile(updated.getEmail());
    }

    public UserPreferenceDto getPreferences(String email) {
        User user = getUserByEmail(email);
        UserPreference pref = userPreferenceRepository.findByUser_UserId(user.getUserId())
                .orElseGet(() -> {
                    UserPreference defaultPref = UserPreference.builder()
                            .user(user)
                            .preferredRouteType("SAFEST")
                            .notificationsEnabled(true)
                            .sosAutoShareLocation(true)
                            .language("en")
                            .build();
                    return userPreferenceRepository.save(defaultPref);
                });

        return UserPreferenceDto.builder()
                .preferenceId(pref.getPreferenceId())
                .preferredRouteType(pref.getPreferredRouteType())
                .notificationsEnabled(pref.getNotificationsEnabled())
                .sosAutoShareLocation(pref.getSosAutoShareLocation())
                .language(pref.getLanguage())
                .build();
    }

    public UserPreferenceDto updatePreferences(String email, UserPreferenceDto request) {
        User user = getUserByEmail(email);
        UserPreference pref = userPreferenceRepository.findByUser_UserId(user.getUserId())
                .orElseGet(() -> UserPreference.builder().user(user).build());

        if (request.getPreferredRouteType() != null) pref.setPreferredRouteType(request.getPreferredRouteType());
        if (request.getNotificationsEnabled() != null) pref.setNotificationsEnabled(request.getNotificationsEnabled());
        if (request.getSosAutoShareLocation() != null) pref.setSosAutoShareLocation(request.getSosAutoShareLocation());
        if (request.getLanguage() != null) pref.setLanguage(request.getLanguage());

        UserPreference saved = userPreferenceRepository.save(pref);

        return UserPreferenceDto.builder()
                .preferenceId(saved.getPreferenceId())
                .preferredRouteType(saved.getPreferredRouteType())
                .notificationsEnabled(saved.getNotificationsEnabled())
                .sosAutoShareLocation(saved.getSosAutoShareLocation())
                .language(saved.getLanguage())
                .build();
    }
}
