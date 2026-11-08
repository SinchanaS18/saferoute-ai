package com.saferoute.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmergencyContactDto {
    private Long contactId;
    private String contactName;
    private String contactPhone;
    private String relationship;
    private Boolean isPrimary;
}
