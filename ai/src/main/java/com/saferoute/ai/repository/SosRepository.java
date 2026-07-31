package com.saferoute.ai.repository;

import com.saferoute.ai.entity.Sos;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SosRepository extends JpaRepository<Sos, Long> {
    List<Sos> findByUser_UserId(Long userId);
    Optional<Sos> findByUser_UserIdAndStatus(Long userId, String status);
}
