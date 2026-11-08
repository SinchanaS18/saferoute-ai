package com.saferoute.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SosRequestDto {
    private Double latitude;
    private Double longitude;
    private String address;
    private Long tripId;
}
