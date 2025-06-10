package com.connectfood.backend.dto;

import com.connectfood.backend.model.Role;
import lombok.Data;

import java.util.Date;

@Data
public class UserProfileDTO {
    private String id;
    private String email;
    private String name;
    private Role role;
    private String profilePicture;
    private String phoneNumber;
    private String address;
    private Date createdAt;
    private Date lastLoginAt;
    private boolean profileComplete;
    
    // Role-specific fields
    private String licenseNumber; // For recipients
    
    // Statistics
    private long totalDonations; // For donors: created, for recipients: collected
    private long totalItems; // Total items donated/collected
    private long activeDonations; // Current active donations
} 