package com.saferoute.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SosResponseDto {
    private Long sosId;
    private Long userId;
    private String userName;
    private String userPhone;
    private Double latitude;
    private Double longitude;
    private String status;
    private LocalDateTime triggeredAt;
    private LocalDateTime resolvedAt;
    private String shareableLink;
    private Integer notifiedContactsCount;
}
