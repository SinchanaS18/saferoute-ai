package com.saferoute.ai.controller;

import com.saferoute.ai.dto.SosRequestDto;
import com.saferoute.ai.dto.SosResponseDto;
import com.saferoute.ai.service.SosService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sos")
@RequiredArgsConstructor
public class SosController {

    private final SosService sosService;

    @PostMapping
    public ResponseEntity<SosResponseDto> triggerSos(@AuthenticationPrincipal String email,
                                                    @RequestBody SosRequestDto request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(sosService.triggerSos(email, request));
    }

    @GetMapping
    public ResponseEntity<List<SosResponseDto>> getMySosAlerts(@AuthenticationPrincipal String email) {
        return ResponseEntity.ok(sosService.getMySosAlerts(email));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SosResponseDto> getSosById(@PathVariable Long id) {
        return ResponseEntity.ok(sosService.getSosById(id));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<SosResponseDto> cancelSos(@AuthenticationPrincipal String email,
                                                     @PathVariable Long id) {
        return ResponseEntity.ok(sosService.cancelSos(email, id));
    }
}
