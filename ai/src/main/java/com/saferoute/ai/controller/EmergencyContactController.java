package com.saferoute.ai.controller;

import com.saferoute.ai.dto.EmergencyContactDto;
import com.saferoute.ai.service.EmergencyContactService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/emergency-contacts")
@RequiredArgsConstructor
public class EmergencyContactController {

    private final EmergencyContactService contactService;

    @GetMapping
    public ResponseEntity<List<EmergencyContactDto>> getContacts(@AuthenticationPrincipal String email) {
        return ResponseEntity.ok(contactService.getContactsForUser(email));
    }

    @PostMapping
    public ResponseEntity<EmergencyContactDto> addContact(@AuthenticationPrincipal String email,
                                                          @RequestBody EmergencyContactDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(contactService.addContact(email, dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmergencyContactDto> updateContact(@AuthenticationPrincipal String email,
                                                             @PathVariable Long id,
                                                             @RequestBody EmergencyContactDto dto) {
        return ResponseEntity.ok(contactService.updateContact(email, id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContact(@AuthenticationPrincipal String email,
                                               @PathVariable Long id) {
        contactService.deleteContact(email, id);
        return ResponseEntity.noContent().build();
    }
}
