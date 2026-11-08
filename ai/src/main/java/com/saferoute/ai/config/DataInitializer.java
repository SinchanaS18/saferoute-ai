package com.saferoute.ai.config;

import com.saferoute.ai.entity.*;
import com.saferoute.ai.repository.*;
import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Polygon;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final UserPreferenceRepository userPreferenceRepository;
    private final SafeZoneRepository safeZoneRepository;
    private final HistoricalCrimeRecordRepository crimeRecordRepository;
    private final PasswordEncoder passwordEncoder;
    private final GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);

    @Override
    public void run(String... args) throws Exception {
        // 1. Ensure Roles
        Role travelerRole = roleRepository.findByRoleName("TRAVELER").orElseGet(() ->
                roleRepository.save(Role.builder().roleName("TRAVELER").description("Standard Traveler User").build())
        );

        Role adminRole = roleRepository.findByRoleName("ADMIN").orElseGet(() ->
                roleRepository.save(Role.builder().roleName("ADMIN").description("Administrator User").build())
        );

        // 2. Ensure Admin User
        if (!userRepository.existsByEmail("admin@saferoute.com") && !userRepository.existsByPhoneNumber("9999999999")) {
            User admin = User.builder()
                    .fullName("System Administrator")
                    .email("admin@saferoute.com")
                    .phoneNumber("9999999999")
                    .passwordHash(passwordEncoder.encode("Admin@123"))
                    .gender("OTHER")
                    .role(adminRole)
                    .isActive(true)
                    .build();
            User savedAdmin = userRepository.save(admin);

            userPreferenceRepository.save(UserPreference.builder()
                    .user(savedAdmin)
                    .preferredRouteType("SAFEST")
                    .notificationsEnabled(true)
                    .sosAutoShareLocation(true)
                    .language("en")
                    .build());
        }

        // 3. Ensure Demo Traveler User
        if (!userRepository.existsByEmail("demo@saferoute.com") && !userRepository.existsByPhoneNumber("9876543210")) {
            User demo = User.builder()
                    .fullName("Demo Traveler")
                    .email("demo@saferoute.com")
                    .phoneNumber("9876543210")
                    .passwordHash(passwordEncoder.encode("Demo@123"))
                    .gender("FEMALE")
                    .role(travelerRole)
                    .isActive(true)
                    .build();
            User savedDemo = userRepository.save(demo);

            userPreferenceRepository.save(UserPreference.builder()
                    .user(savedDemo)
                    .preferredRouteType("SAFEST")
                    .notificationsEnabled(true)
                    .sosAutoShareLocation(true)
                    .language("en")
                    .build());
        }

        // 4. Seed initial Safe Zones if empty
        if (safeZoneRepository.count() == 0) {
            double lat = 12.9716, lng = 77.5946;
            double radius = 0.005;
            Polygon poly = geometryFactory.createPolygon(new Coordinate[]{
                    new Coordinate(lng - radius, lat - radius),
                    new Coordinate(lng + radius, lat - radius),
                    new Coordinate(lng + radius, lat + radius),
                    new Coordinate(lng - radius, lat + radius),
                    new Coordinate(lng - radius, lat - radius)
            });

            safeZoneRepository.save(SafeZone.builder()
                    .name("Central Police Station & CCTV Safe Hub")
                    .description("High security area with 24/7 police patrolling, vibrant street lights, and emergency call boxes.")
                    .zoneGeom(poly)
                    .createdAt(LocalDateTime.now())
                    .build());
        }
    }
}
