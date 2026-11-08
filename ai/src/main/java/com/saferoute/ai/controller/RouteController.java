package com.saferoute.ai.controller;

import com.saferoute.ai.dto.RouteRequestDto;
import com.saferoute.ai.dto.RouteResponseDto;
import com.saferoute.ai.service.RouteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/routes")
@RequiredArgsConstructor
public class RouteController {

    private final RouteService routeService;

    @PostMapping("/calculate")
    public ResponseEntity<List<RouteResponseDto>> calculateRoutes(@RequestBody RouteRequestDto request) {
        return ResponseEntity.ok(routeService.calculateRoutes(request));
    }
}
