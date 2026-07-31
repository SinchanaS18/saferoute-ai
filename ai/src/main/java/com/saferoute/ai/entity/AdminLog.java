package com.saferoute.ai.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "admin_logs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AdminLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "log_id")
    private Long logId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id", nullable = false)
    private User admin;

    @Column(name = "action", nullable = false)
    private String action;

    @Column(name = "target_table", length = 50)
    private String targetTable;

    @Column(name = "target_id")
    private Integer targetId;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
