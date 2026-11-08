package com.saferoute.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserPreferenceDto {
    private Long preferenceId;
    private String preferredRouteType;
    private Boolean notificationsEnabled;
    private Boolean sosAutoShareLocation;
    private String language;
}
