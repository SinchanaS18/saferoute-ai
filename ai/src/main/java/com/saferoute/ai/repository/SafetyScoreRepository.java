package com.saferoute.ai.repository;

import com.saferoute.ai.entity.SafetyScore;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SafetyScoreRepository extends JpaRepository<SafetyScore, Long> {
    Optional<SafetyScore> findByRoute_RouteId(Long routeId);
}
