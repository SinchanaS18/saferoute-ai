package com.saferoute.ai.repository;

import com.saferoute.ai.entity.EmergencyContact;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EmergencyContactRepository extends JpaRepository<EmergencyContact, Long> {
    List<EmergencyContact> findByUser_UserId(Long userId);
}