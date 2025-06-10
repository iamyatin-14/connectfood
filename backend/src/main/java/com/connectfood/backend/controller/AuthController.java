package com.connectfood.backend.controller;

import com.connectfood.backend.model.Donor;
import com.connectfood.backend.model.Recipient;
import com.connectfood.backend.repository.DonorRepository;
import com.connectfood.backend.repository.RecipientRepository;
import com.connectfood.backend.service.GoogleTokenVerifier;
import com.connectfood.backend.security.JwtUtil;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173") // your frontend URL
public class AuthController {

    @Autowired
    private DonorRepository donorRepository;

    @Autowired
    private RecipientRepository recipientRepository;

    @Autowired
    private GoogleTokenVerifier googleTokenVerifier;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> body) throws GeneralSecurityException, IOException {
        String idTokenString = body.get("idToken");
        String role = body.get("role");

        Payload payload = googleTokenVerifier.verify(idTokenString);
        if (payload == null) {
            return ResponseEntity.badRequest().body("Invalid Google token");
        }

        String email = payload.getEmail();
        String name = (String) payload.get("name");
        String profilePicture = (String) payload.get("picture");

        if ("donor".equals(role)) {
            Optional<Donor> existing = donorRepository.findByEmail(email);
            if (existing.isEmpty()) {
                Donor donor = new Donor(email, name);
                donor.setProfilePicture(profilePicture);
                donorRepository.save(donor);
            } else {
                // Update existing donor's profile picture and last login
                Donor donor = existing.get();
                donor.setProfilePicture(profilePicture);
                donor.setLastLoginAt(new java.util.Date());
                donorRepository.save(donor);
            }
            // Check if recipient exists with same email
            if (recipientRepository.findByEmail(email).isPresent()) {
                return ResponseEntity.badRequest().body("User already registered as recipient");
            }
        } else if ("recipient".equals(role)) {
            Optional<Recipient> existing = recipientRepository.findByEmail(email);
            if (existing.isEmpty()) {
                Recipient recipient = new Recipient();
                recipient.setEmail(email);
                recipient.setName(name);
                recipient.setProfilePicture(profilePicture);
                recipientRepository.save(recipient);
            } else {
                // Update existing recipient's profile picture and last login
                Recipient recipient = existing.get();
                recipient.setProfilePicture(profilePicture);
                recipient.setLastLoginAt(new java.util.Date());
                recipientRepository.save(recipient);
            }
            // Check if donor exists with same email
            if (donorRepository.findByEmail(email).isPresent()) {
                return ResponseEntity.badRequest().body("User already registered as donor");
            }
        } else {
            return ResponseEntity.badRequest().body("Invalid role");
        }

        String jwt = jwtUtil.generateToken(email, role);

        return ResponseEntity.ok(Map.of("jwtToken", jwt, "role", role));
    }
}
