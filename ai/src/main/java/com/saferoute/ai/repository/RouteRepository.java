package com.saferoute.ai.repository;

import com.saferoute.ai.entity.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface RouteRepository extends JpaRepository<Route, Long> {
    List<Route> findByTrip_TripId(Long tripId);
    Optional<Route> findByTrip_TripIdAndIsSelectedTrue(Long tripId);
}