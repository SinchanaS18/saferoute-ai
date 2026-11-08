package com.saferoute.ai.service;

import com.saferoute.ai.dto.SafeZoneDto;
import com.saferoute.ai.entity.SafeZone;
import com.saferoute.ai.repository.SafeZoneRepository;
import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Polygon;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SafeZoneService {

    private final SafeZoneRepository safeZoneRepository;
    private final GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);

    public List<SafeZoneDto> getAllSafeZones() {
        return safeZoneRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public SafeZoneDto createSafeZone(SafeZoneDto dto) {
        double lat = dto.getCenterLat() != null ? dto.getCenterLat() : 12.9716;
        double lng = dto.getCenterLng() != null ? dto.getCenterLng() : 77.5946;
        double radiusDeg = 0.005; // ~500m

        Coordinate[] coords = new Coordinate[]{
                new Coordinate(lng - radiusDeg, lat - radiusDeg),
                new Coordinate(lng + radiusDeg, lat - radiusDeg),
                new Coordinate(lng + radiusDeg, lat + radiusDeg),
                new Coordinate(lng - radiusDeg, lat + radiusDeg),
                new Coordinate(lng - radiusDeg, lat - radiusDeg)
        };

        Polygon polygon = geometryFactory.createPolygon(coords);

        SafeZone zone = SafeZone.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .zoneGeom(polygon)
                .createdAt(LocalDateTime.now())
                .build();

        SafeZone saved = safeZoneRepository.save(zone);
        return mapToDto(saved);
    }

    public SafeZoneDto updateSafeZone(Long id, SafeZoneDto dto) {
        SafeZone zone = safeZoneRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Safe zone not found"));

        if (dto.getName() != null) zone.setName(dto.getName());
        if (dto.getDescription() != null) zone.setDescription(dto.getDescription());

        return mapToDto(safeZoneRepository.save(zone));
    }

    public void deleteSafeZone(Long id) {
        safeZoneRepository.deleteById(id);
    }

    private SafeZoneDto mapToDto(SafeZone zone) {
        double centerLat = 12.9716;
        double centerLng = 77.5946;

        if (zone.getZoneGeom() != null) {
            org.locationtech.jts.geom.Point centroid = zone.getZoneGeom().getCentroid();
            centerLat = centroid.getY();
            centerLng = centroid.getX();
        }

        return SafeZoneDto.builder()
                .zoneId(zone.getZoneId())
                .name(zone.getName())
                .description(zone.getDescription())
                .centerLat(centerLat)
                .centerLng(centerLng)
                .radiusMeters(500.0)
                .build();
    }
}
