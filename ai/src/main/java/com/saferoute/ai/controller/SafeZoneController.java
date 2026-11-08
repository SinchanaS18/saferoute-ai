package com.saferoute.ai.controller;

import com.saferoute.ai.dto.SafeZoneDto;
import com.saferoute.ai.service.SafeZoneService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/safe-zones")
@RequiredArgsConstructor
public class SafeZoneController {

    private final SafeZoneService safeZoneService;

    @GetMapping
    public ResponseEntity<List<SafeZoneDto>> getSafeZones() {
        return ResponseEntity.ok(safeZoneService.getAllSafeZones());
    }

    @PostMapping
    public ResponseEntity<SafeZoneDto> createSafeZone(@RequestBody SafeZoneDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(safeZoneService.createSafeZone(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SafeZoneDto> updateSafeZone(@PathVariable Long id, @RequestBody SafeZoneDto dto) {
        return ResponseEntity.ok(safeZoneService.updateSafeZone(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSafeZone(@PathVariable Long id) {
        safeZoneService.deleteSafeZone(id);
        return ResponseEntity.noContent().build();
    }
}
