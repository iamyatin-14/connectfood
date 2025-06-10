package com.connectfood.backend.controller;

import com.connectfood.backend.dto.UserProfileDTO;
import com.connectfood.backend.service.ProfileService;
import com.connectfood.backend.security.JwtUtil;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:5173")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @Autowired
    private JwtUtil jwtUtil;

    // Helper method to extract email and role from JWT token
    private Map<String, String> getEmailAndRoleFromToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return null;
        String token = authHeader.substring(7);
        try {
            Jws<Claims> jws = jwtUtil.validateToken(token);
            Claims claims = jws.getBody();
            String email = claims.getSubject();
            String role = claims.get("role", String.class);
            return Map.of("email", email, "role", role);
        } catch (Exception e) {
            return null;
        }
    }

    @GetMapping
    public ResponseEntity<?> getUserProfile(@RequestHeader("Authorization") String authHeader) {
        Map<String, String> userInfo = getEmailAndRoleFromToken(authHeader);
        if (userInfo == null) {
            return ResponseEntity.status(401).body("Invalid or missing token");
        }

        String email = userInfo.get("email");
        String role = userInfo.get("role");

        UserProfileDTO profile = profileService.getUserProfile(email, role);
        if (profile == null) {
            return ResponseEntity.notFound().build();
        }

        // Update last login time
        profileService.updateLastLogin(email, role);

        return ResponseEntity.ok(profile);
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getUserStats(@RequestHeader("Authorization") String authHeader) {
        Map<String, String> userInfo = getEmailAndRoleFromToken(authHeader);
        if (userInfo == null) {
            return ResponseEntity.status(401).body("Invalid or missing token");
        }

        String email = userInfo.get("email");
        String role = userInfo.get("role");

        UserProfileDTO profile = profileService.getUserProfile(email, role);
        if (profile == null) {
            return ResponseEntity.notFound().build();
        }

        // Return only statistics
        Map<String, Object> stats = Map.of(
            "totalDonations", profile.getTotalDonations(),
            "totalItems", profile.getTotalItems(),
            "activeDonations", profile.getActiveDonations(),
            "role", profile.getRole()
        );

        return ResponseEntity.ok(stats);
    }

    @PutMapping
    public ResponseEntity<?> updateProfile(@RequestHeader("Authorization") String authHeader, @RequestBody Map<String, Object> updates) {
        Map<String, String> userInfo = getEmailAndRoleFromToken(authHeader);
        if (userInfo == null) {
            return ResponseEntity.status(401).body("Invalid or missing token");
        }
        String email = userInfo.get("email");
        String role = userInfo.get("role");
        boolean profileComplete = false;
        if ("donor".equals(role)) {
            profileComplete = profileService.updateDonorProfile(email, updates);
        } else if ("recipient".equals(role)) {
            profileComplete = profileService.updateRecipientProfile(email, updates);
        } else {
            return ResponseEntity.badRequest().body("Invalid role");
        }
        return ResponseEntity.ok(Map.of("profileComplete", profileComplete));
    }
} 