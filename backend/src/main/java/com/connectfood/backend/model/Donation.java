package com.connectfood.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

import java.util.Date;

@Data
@Document(collection = "donations")
public class Donation {
    @Id
    private String id;
    
    @Version
    private Long version;
    
    private String donorEmail;
    private String donorName;
    private String foodItem;
    private String description;
    private int quantity;
    private String unit;
    private String city;
    private String district;
    private String address;
    private Double latitude;
    private Double longitude;
    private Date expiryDate;
    private String specialInstructions;
    
    // Collection status fields
    private boolean collected = false;
    private boolean collectionInitiated = false;
    private String initiatedBy;
    private Date initiatedAt;
    private String collectedBy;
    private Date collectedAt;
    private Date createdAt = new Date();

    // Constructors, Getters, Setters
    public Donation() {}

    public Donation(String donorEmail, String city, String district, String address, int quantity, boolean collected) {
        this.donorEmail = donorEmail;
        this.city = city;
        this.district = district;
        this.address = address;
        this.quantity = quantity;
        this.collected = collected;
    }
    // getters/setters omitted
}
