package com.saferoute.ai.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "safety_scores")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SafetyScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "score_id")
    private Long scoreId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "route_id", nullable = false, unique = true)
    private Route route;

    @Column(name = "safety_score", nullable = false)
    private Integer safetyScore;

    @Column(name = "risk_level", length = 10)
    private String riskLevel;

    @Column(name = "explanation", columnDefinition = "TEXT")
    private String explanation;

    @Column(name = "calculated_at")
    private LocalDateTime calculatedAt = LocalDateTime.now();
}
