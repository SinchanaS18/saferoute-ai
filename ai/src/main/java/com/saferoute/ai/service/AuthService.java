package com.saferoute.ai.service;

import com.saferoute.ai.dto.*;
import com.saferoute.ai.entity.*;
import com.saferoute.ai.repository.*;
import com.saferoute.ai.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserPreferenceRepository userPreferenceRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest request) {
        // Validate: Email Exists?
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }
        if (userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new IllegalArgumentException("Phone number already registered");
        }

        // Default role: TRAVELER
        Role travelerRole = roleRepository.findByRoleName("TRAVELER")
                .orElseThrow(() -> new IllegalStateException("TRAVELER role not found in database"));

        // Save User
        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .gender(request.getGender())
                .role(travelerRole)
                .isActive(true)
                .build();

        User savedUser = userRepository.save(user);

        // Create default UserPreference row (1:1)
        UserPreference preference = UserPreference.builder()
                .user(savedUser)
                .preferredRouteType("SAFEST")
                .notificationsEnabled(true)
                .sosAutoShareLocation(true)
                .language("en")
                .build();
        userPreferenceRepository.save(preference);

        // Generate JWT Token
        String token = jwtUtil.generateToken(savedUser.getEmail(), savedUser.getUserId(), savedUser.getRole().getRoleName());

        return AuthResponse.builder()
                .token(token)
                .userId(savedUser.getUserId())
                .fullName(savedUser.getFullName())
                .email(savedUser.getEmail())
                .role(savedUser.getRole().getRoleName())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        // Verify User: try email first, then phone
        User user = userRepository.findByEmail(request.getEmailOrPhone())
                .or(() -> userRepository.findByPhoneNumber(request.getEmailOrPhone()))
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        // Invalid Credentials check
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        if (!Boolean.TRUE.equals(user.getIsActive())) {
            throw new IllegalArgumentException("Account is deactivated");
        }

        // Generate JWT Token
        String token = jwtUtil.generateToken(user.getEmail(), user.getUserId(), user.getRole().getRoleName());

        return AuthResponse.builder()
                .token(token)
                .userId(user.getUserId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole().getRoleName())
                .build();
    }
}