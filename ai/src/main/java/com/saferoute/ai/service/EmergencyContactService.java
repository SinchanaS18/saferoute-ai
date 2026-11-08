package com.saferoute.ai.service;

import com.saferoute.ai.dto.EmergencyContactDto;
import com.saferoute.ai.entity.EmergencyContact;
import com.saferoute.ai.entity.User;
import com.saferoute.ai.repository.EmergencyContactRepository;
import com.saferoute.ai.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmergencyContactService {

    private final EmergencyContactRepository contactRepository;
    private final UserRepository userRepository;

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    public List<EmergencyContactDto> getContactsForUser(String email) {
        User user = getUserByEmail(email);
        return contactRepository.findByUser_UserId(user.getUserId())
                .stream()
                .map(c -> EmergencyContactDto.builder()
                        .contactId(c.getContactId())
                        .contactName(c.getContactName())
                        .contactPhone(c.getContactPhone())
                        .relationship(c.getRelationship())
                        .isPrimary(c.getIsPrimary())
                        .build())
                .collect(Collectors.toList());
    }

    public EmergencyContactDto addContact(String email, EmergencyContactDto dto) {
        User user = getUserByEmail(email);
        EmergencyContact contact = EmergencyContact.builder()
                .user(user)
                .contactName(dto.getContactName())
                .contactPhone(dto.getContactPhone())
                .relationship(dto.getRelationship() != null ? dto.getRelationship() : "Family")
                .isPrimary(dto.getIsPrimary() != null ? dto.getIsPrimary() : false)
                .build();

        EmergencyContact saved = contactRepository.save(contact);
        return EmergencyContactDto.builder()
                .contactId(saved.getContactId())
                .contactName(saved.getContactName())
                .contactPhone(saved.getContactPhone())
                .relationship(saved.getRelationship())
                .isPrimary(saved.getIsPrimary())
                .build();
    }

    public EmergencyContactDto updateContact(String email, Long id, EmergencyContactDto dto) {
        User user = getUserByEmail(email);
        EmergencyContact contact = contactRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Contact not found"));

        if (!contact.getUser().getUserId().equals(user.getUserId())) {
            throw new IllegalArgumentException("Unauthorized access to contact");
        }

        if (dto.getContactName() != null) contact.setContactName(dto.getContactName());
        if (dto.getContactPhone() != null) contact.setContactPhone(dto.getContactPhone());
        if (dto.getRelationship() != null) contact.setRelationship(dto.getRelationship());
        if (dto.getIsPrimary() != null) contact.setIsPrimary(dto.getIsPrimary());

        EmergencyContact saved = contactRepository.save(contact);
        return EmergencyContactDto.builder()
                .contactId(saved.getContactId())
                .contactName(saved.getContactName())
                .contactPhone(saved.getContactPhone())
                .relationship(saved.getRelationship())
                .isPrimary(saved.getIsPrimary())
                .build();
    }

    public void deleteContact(String email, Long id) {
        User user = getUserByEmail(email);
        EmergencyContact contact = contactRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Contact not found"));

        if (!contact.getUser().getUserId().equals(user.getUserId())) {
            throw new IllegalArgumentException("Unauthorized access to contact");
        }

        contactRepository.delete(contact);
    }
}
