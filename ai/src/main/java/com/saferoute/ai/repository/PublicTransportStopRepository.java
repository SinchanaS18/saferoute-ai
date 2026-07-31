package com.saferoute.ai.repository;

import com.saferoute.ai.entity.PublicTransportStop;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PublicTransportStopRepository extends JpaRepository<PublicTransportStop, Long> {
}
