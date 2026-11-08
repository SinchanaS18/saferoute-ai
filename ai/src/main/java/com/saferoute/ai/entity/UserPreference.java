package com.saferoute.ai.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_preferences")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UserPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "preference_id")
    private Long preferenceId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Builder.Default
    @Column(name = "preferred_route_type", length = 20)
    private String preferredRouteType = "SAFEST";

    @Builder.Default
    @Column(name = "notifications_enabled")
    private Boolean notificationsEnabled = true;

    @Builder.Default
    @Column(name = "sos_auto_share_location")
    private Boolean sosAutoShareLocation = true;

    @Builder.Default
    @Column(name = "language", length = 10)
    private String language = "en";

    @Builder.Default
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Builder.Default
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
}