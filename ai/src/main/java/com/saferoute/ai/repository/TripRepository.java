package com.saferoute.ai.repository;

import com.saferoute.ai.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TripRepository extends JpaRepository<Trip, Long> {
    List<Trip> findByUser_UserId(Long userId);
    List<Trip> findByUser_UserIdAndTripStatus(Long userId, String tripStatus);
}