package com.connectfood.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;
import java.util.Date;

@Data
@Document(collection = "donors")
public class Donor {
    @Id
    private String id;
    private String email;
    private String name;
    private Role role = Role.DONOR;
    
    // Additional profile fields
    private String phoneNumber;
    private String profilePicture;
    private String address;
    private Date createdAt;
    private Date lastLoginAt;
    private boolean profileComplete = false;

    public Donor() {
        this.createdAt = new Date();
        this.lastLoginAt = new Date();
    }
    
    public Donor(String email, String name) {
        this();
        this.email = email;
        this.name = name;
    }
}
