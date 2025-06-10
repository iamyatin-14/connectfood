package com.connectfood.backend.controller;

import com.connectfood.backend.model.Donation;
import com.connectfood.backend.model.Donor;
import com.connectfood.backend.model.Recipient;
import com.connectfood.backend.repository.DonationRepository;
import com.connectfood.backend.repository.DonorRepository;
import com.connectfood.backend.repository.RecipientRepository;
import com.connectfood.backend.security.JwtUtil;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/donations")
@CrossOrigin(origins = "http://localhost:5173") // adjust this to your frontend origin
public class DonationController {

    @Autowired
    private DonationRepository donationRepository;

    @Autowired
    private DonorRepository donorRepository;

    @Autowired
    private RecipientRepository recipientRepository;

    @Autowired
    private JwtUtil jwtUtil;

    // Helper method to extract email from JWT token
    private String getEmailFromToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return null;
        String token = authHeader.substring(7);
        try {
            Jws<Claims> jws = jwtUtil.validateToken(token);
            return jws.getBody().getSubject();
        } catch (Exception e) {
            return null;
        }
    }

    // ===========================
    // DONOR: Create a donation
    // ===========================
    @PostMapping
    public ResponseEntity<?> createDonation(@RequestBody Donation donation, @RequestHeader("Authorization") String authHeader) {
        try {
            String email = getEmailFromToken(authHeader);
            if (email == null) {
                return ResponseEntity.status(401).body("Invalid token");
            }

            // Get donor and check profile completion
            Optional<Donor> donorOpt = donorRepository.findByEmail(email);
            if (donorOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Donor not found");
            }

            Donor donor = donorOpt.get();
            if (!donor.isProfileComplete()) {
                return ResponseEntity.badRequest().body("Please complete your profile before creating donations");
            }

            donation.setDonorEmail(email);
            donation.setDonorName(donor.getName());
            donation.setCreatedAt(new Date());
            donation.setCollected(false);

            Donation savedDonation = donationRepository.save(donation);
            return ResponseEntity.ok(savedDonation);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to create donation: " + e.getMessage());
        }
    }

    // ===========================
    // DONOR: View my donations
    // ===========================
    @GetMapping("/my")
    public ResponseEntity<?> getMyDonations(@RequestHeader("Authorization") String authHeader) {
        String email = getEmailFromToken(authHeader);
        if (email == null) return ResponseEntity.status(401).body("Invalid or missing token");

        List<Donation> myDonations = donationRepository.findByDonorEmail(email);
        return ResponseEntity.ok(myDonations);
    }

    // ===========================
    // RECIPIENT: Search live donations
    // ===========================
    @GetMapping("/live")
    public ResponseEntity<?> getLiveDonations(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(defaultValue = "") String city,
            @RequestParam(defaultValue = "") String district,
            @RequestParam(defaultValue = "0") int minQty) {

        String email = getEmailFromToken(authHeader);
        if (email == null) return ResponseEntity.status(401).body("Invalid or missing token");

        List<Donation> liveDonations = donationRepository
                .findByCollectedFalseAndCityContainingIgnoreCaseAndDistrictContainingIgnoreCaseAndQuantityGreaterThanEqual(
                        city, district, minQty);
        return ResponseEntity.ok(liveDonations);
    }

    // ===========================
    // RECIPIENT: Initiate collection
    // ===========================
    @PutMapping("/{id}/initiate")
    public ResponseEntity<?> initiateCollection(@PathVariable String id, @RequestHeader("Authorization") String authHeader) {
        try {
            String email = getEmailFromToken(authHeader);
            if (email == null) {
                return ResponseEntity.status(401).body("Invalid token");
            }

            // Use MongoDB's atomic operations to prevent race conditions
            Optional<Donation> donationOpt = donationRepository.findById(id);
            if (donationOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Donation donation = donationOpt.get();
            
            // Check if already collected or initiated
            if (donation.isCollected()) {
                return ResponseEntity.badRequest().body("Donation already collected");
            }

            if (donation.isCollectionInitiated()) {
                return ResponseEntity.badRequest().body("Collection already initiated");
            }

            // Get recipient organization name
            Optional<Recipient> recipientOpt = recipientRepository.findByEmail(email);
            if (recipientOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Recipient not found");
            }

            // Use atomic update to prevent race conditions
            String organizationName = recipientOpt.get().getOrganizationName();
            Date initiatedAt = new Date();
            
            // Try to atomically update the donation
            Donation updatedDonation = donationRepository.findById(id)
                .map(existingDonation -> {
                    if (existingDonation.isCollected() || existingDonation.isCollectionInitiated()) {
                        return null; // Already processed
                    }
                    existingDonation.setCollectionInitiated(true);
                    existingDonation.setInitiatedBy(organizationName);
                    existingDonation.setInitiatedAt(initiatedAt);
                    return donationRepository.save(existingDonation);
                })
                .orElse(null);

            if (updatedDonation == null) {
                return ResponseEntity.badRequest().body("Donation is no longer available for collection");
            }

            return ResponseEntity.ok(updatedDonation);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to initiate collection: " + e.getMessage());
        }
    }

    // ===========================
    // RECIPIENT: Collect a donation
    // ===========================
    @PutMapping("/{id}/collect")
    public ResponseEntity<?> collectDonation(@PathVariable String id, @RequestHeader("Authorization") String authHeader) {
        try {
            String email = getEmailFromToken(authHeader);
            if (email == null) {
                return ResponseEntity.status(401).body("Invalid token");
            }

            // Get recipient organization name first
            Optional<Recipient> recipientOpt = recipientRepository.findByEmail(email);
            if (recipientOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Recipient not found");
            }
            String organizationName = recipientOpt.get().getOrganizationName();

            // Use atomic update to prevent race conditions
            Donation updatedDonation = donationRepository.findById(id)
                .map(donation -> {
                    if (donation.isCollected()) {
                        return null; // Already collected
                    }

                    if (!donation.isCollectionInitiated()) {
                        return null; // Not initiated
                    }

                    // Verify the same recipient is collecting
                    if (!donation.getInitiatedBy().equals(organizationName)) {
                        return null; // Wrong recipient
                    }

                    donation.setCollected(true);
                    donation.setCollectedBy(organizationName);
                    donation.setCollectedAt(new Date());
                    return donationRepository.save(donation);
                })
                .orElse(null);

            if (updatedDonation == null) {
                return ResponseEntity.badRequest().body("Donation cannot be collected. It may have been collected by another organization or is not available.");
            }

            return ResponseEntity.ok(updatedDonation);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to collect donation: " + e.getMessage());
        }
    }

    // ===========================
    // RECIPIENT: View collected donations
    // ===========================
    @GetMapping("/received")
    public ResponseEntity<?> getReceivedDonations(@RequestHeader("Authorization") String authHeader) {
        String email = getEmailFromToken(authHeader);
        if (email == null) return ResponseEntity.status(401).body("Invalid or missing token");

        List<Donation> receivedDonations = donationRepository.findByCollectedTrue();
        return ResponseEntity.ok(receivedDonations);
    }
}
