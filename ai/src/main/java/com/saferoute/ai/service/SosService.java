package com.saferoute.ai.service;

import com.saferoute.ai.dto.SosRequestDto;
import com.saferoute.ai.dto.SosResponseDto;
import com.saferoute.ai.entity.EmergencyContact;
import com.saferoute.ai.entity.Notification;
import com.saferoute.ai.entity.Sos;
import com.saferoute.ai.entity.User;
import com.saferoute.ai.repository.EmergencyContactRepository;
import com.saferoute.ai.repository.NotificationRepository;
import com.saferoute.ai.repository.SosRepository;
import com.saferoute.ai.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SosService {

    private final SosRepository sosRepository;
    private final UserRepository userRepository;
    private final EmergencyContactRepository contactRepository;
    private final NotificationRepository notificationRepository;
    private final GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    public SosResponseDto triggerSos(String email, SosRequestDto request) {
        User user = getUserByEmail(email);

        // Cancel any active SOS first if present
        sosRepository.findByUser_UserIdAndStatus(user.getUserId(), "ACTIVE")
                .ifPresent(existing -> {
                    existing.setStatus("SUPERSEDED");
                    existing.setResolvedAt(LocalDateTime.now());
                    sosRepository.save(existing);
                });

        org.locationtech.jts.geom.Point point = geometryFactory.createPoint(
                new Coordinate(request.getLongitude(), request.getLatitude())
        );

        Sos sos = Sos.builder()
                .user(user)
                .locationGeom(point)
                .status("ACTIVE")
                .triggeredAt(LocalDateTime.now())
                .build();

        Sos saved = sosRepository.save(sos);

        // Notify user emergency contacts
        List<EmergencyContact> contacts = contactRepository.findByUser_UserId(user.getUserId());
        for (EmergencyContact contact : contacts) {
            Notification notification = Notification.builder()
                    .user(user)
                    .title("EMERGENCY SOS ALERT!")
                    .message(String.format("EMERGENCY ALERT: User %s triggered SOS at (%.4f, %.4f). Alert sent to %s (%s).",
                            user.getFullName(), request.getLatitude(), request.getLongitude(), contact.getContactName(), contact.getContactPhone()))
                    .type("SOS_ALERT")
                    .isRead(false)
                    .build();
            notificationRepository.save(notification);
        }

        return mapToDto(saved, contacts.size(), request.getLatitude(), request.getLongitude());
    }

    public List<SosResponseDto> getMySosAlerts(String email) {
        User user = getUserByEmail(email);
        return sosRepository.findByUser_UserId(user.getUserId()).stream()
                .map(s -> mapToDto(s, 0, s.getLocationGeom().getY(), s.getLocationGeom().getX()))
                .collect(Collectors.toList());
    }

    public SosResponseDto getSosById(Long id) {
        Sos sos = sosRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("SOS alert not found"));
        return mapToDto(sos, 0, sos.getLocationGeom().getY(), sos.getLocationGeom().getX());
    }

    public SosResponseDto cancelSos(String email, Long id) {
        User user = getUserByEmail(email);
        Sos sos = sosRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("SOS alert not found"));

        if (!sos.getUser().getUserId().equals(user.getUserId())) {
            throw new IllegalArgumentException("Unauthorized action");
        }

        sos.setStatus("CANCELLED");
        sos.setResolvedAt(LocalDateTime.now());
        Sos updated = sosRepository.save(sos);

        Notification notification = Notification.builder()
                .user(user)
                .title("SOS ALERT CANCELLED")
                .message(String.format("User %s has safely cancelled their emergency SOS alert.", user.getFullName()))
                .type("SOS_CANCELLED")
                .isRead(false)
                .build();
        notificationRepository.save(notification);

        return mapToDto(updated, 0, updated.getLocationGeom().getY(), updated.getLocationGeom().getX());
    }

    private SosResponseDto mapToDto(Sos sos, int contactsCount, double lat, double lng) {
        String shareLink = String.format("https://maps.google.com/?q=%.6f,%.6f", lat, lng);
        return SosResponseDto.builder()
                .sosId(sos.getSosId())
                .userId(sos.getUser().getUserId())
                .userName(sos.getUser().getFullName())
                .userPhone(sos.getUser().getPhoneNumber())
                .latitude(lat)
                .longitude(lng)
                .status(sos.getStatus())
                .triggeredAt(sos.getTriggeredAt())
                .resolvedAt(sos.getResolvedAt())
                .shareableLink(shareLink)
                .notifiedContactsCount(contactsCount)
                .build();
    }
}
