package com.saferoute.ai.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "emergency_contacts")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class EmergencyContact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "contact_id")
    private Long contactId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "contact_name", nullable = false, length = 100)
    private String contactName;

    @Column(name = "contact_phone", nullable = false, length = 15)
    private String contactPhone;

    @Column(name = "relationship", length = 50)
    private String relationship;

    @Builder.Default
    @Column(name = "is_primary")
    private Boolean isPrimary = false;

    @Builder.Default
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}