package com.connectfood.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Document(collection = "recipients")
public class Recipient {
    @Id
    private String id;
    private String email;
    private String name;
    private String organizationName;
    private String licenseNumber;
    private Role role = Role.RECIPIENT;
    
    // Additional profile fields
    private String phoneNumber;
    private String profilePicture;
    private String address;
    private Date createdAt;
    private Date lastLoginAt;
    private boolean profileComplete = false;

    public Recipient() {
        this.createdAt = new Date();
        this.lastLoginAt = new Date();
    }
    
    public Recipient(String email, String name, String licenseNumber, String organizationName) {
        this();
        this.email = email;
        this.name = name;
        this.licenseNumber = licenseNumber;
        this.organizationName = organizationName;
    }

    // getters and setters
}

