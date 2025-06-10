package com.connectfood.backend.service;

import com.connectfood.backend.dto.UserProfileDTO;
import com.connectfood.backend.model.Donor;
import com.connectfood.backend.model.Recipient;
import com.connectfood.backend.repository.DonorRepository;
import com.connectfood.backend.repository.RecipientRepository;
import com.connectfood.backend.repository.DonationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class ProfileService {

    @Autowired
    DonorRepository donorRepository;

    @Autowired
    RecipientRepository recipientRepository;

    @Autowired
    private DonationRepository donationRepository;

    public UserProfileDTO getUserProfile(String email, String role) {
        if ("donor".equals(role)) {
            return getDonorProfile(email);
        } else if ("recipient".equals(role)) {
            return getRecipientProfile(email);
        }
        return null;
    }

    private UserProfileDTO getDonorProfile(String email) {
        Optional<Donor> donorOpt = donorRepository.findByEmail(email);
        if (donorOpt.isEmpty()) {
            return null;
        }

        Donor donor = donorOpt.get();
        UserProfileDTO profile = new UserProfileDTO();
        
        // Basic info
        profile.setId(donor.getId());
        profile.setEmail(donor.getEmail());
        profile.setName(donor.getName());
        profile.setRole(donor.getRole());
        profile.setPhoneNumber(donor.getPhoneNumber());
        profile.setProfilePicture(donor.getProfilePicture());
        profile.setAddress(donor.getAddress());
        profile.setCreatedAt(donor.getCreatedAt());
        profile.setLastLoginAt(donor.getLastLoginAt());
        profile.setProfileComplete(donor.isProfileComplete());
        
        // Statistics
        long totalDonations = donationRepository.countByDonorEmail(email);
        long totalItems = donationRepository.findByDonorEmail(email)
                .stream()
                .mapToLong(donation -> donation.getQuantity())
                .sum();
        long activeDonations = donationRepository.countByDonorEmailAndCollectedFalse(email);
        
        profile.setTotalDonations(totalDonations);
        profile.setTotalItems(totalItems);
        profile.setActiveDonations(activeDonations);
        
        return profile;
    }

    private UserProfileDTO getRecipientProfile(String email) {
        Optional<Recipient> recipientOpt = recipientRepository.findByEmail(email);
        if (recipientOpt.isEmpty()) {
            return null;
        }

        Recipient recipient = recipientOpt.get();
        UserProfileDTO profile = new UserProfileDTO();
        
        // Basic info
        profile.setId(recipient.getId());
        profile.setEmail(recipient.getEmail());
        profile.setName(recipient.getName());
        profile.setRole(recipient.getRole());
        profile.setPhoneNumber(recipient.getPhoneNumber());
        profile.setProfilePicture(recipient.getProfilePicture());
        profile.setAddress(recipient.getAddress());
        profile.setCreatedAt(recipient.getCreatedAt());
        profile.setLastLoginAt(recipient.getLastLoginAt());
        profile.setProfileComplete(recipient.isProfileComplete());
        profile.setLicenseNumber(recipient.getLicenseNumber());
        
        // Statistics
        long totalDonations = donationRepository.countByCollectedTrue();
        long totalItems = donationRepository.findByCollectedTrue()
                .stream()
                .mapToLong(donation -> donation.getQuantity())
                .sum();
        long activeDonations = donationRepository.countByCollectedFalse();
        
        profile.setTotalDonations(totalDonations);
        profile.setTotalItems(totalItems);
        profile.setActiveDonations(activeDonations);
        
        return profile;
    }

    public void updateLastLogin(String email, String role) {
        if ("donor".equals(role)) {
            donorRepository.findByEmail(email).ifPresent(donor -> {
                donor.setLastLoginAt(new java.util.Date());
                donorRepository.save(donor);
            });
        } else if ("recipient".equals(role)) {
            recipientRepository.findByEmail(email).ifPresent(recipient -> {
                recipient.setLastLoginAt(new java.util.Date());
                recipientRepository.save(recipient);
            });
        }
    }

    public boolean updateDonorProfile(String email, Map<String, Object> updates) {
        Optional<Donor> donorOpt = donorRepository.findByEmail(email);
        if (donorOpt.isEmpty()) return false;
        Donor donor = donorOpt.get();
        if (updates.containsKey("name")) donor.setName((String) updates.get("name"));
        if (updates.containsKey("phoneNumber")) donor.setPhoneNumber((String) updates.get("phoneNumber"));
        if (updates.containsKey("address")) donor.setAddress((String) updates.get("address"));
        if (updates.containsKey("profilePicture")) donor.setProfilePicture((String) updates.get("profilePicture"));
        
        // Check if all required fields are present and not empty
        boolean profileComplete = donor.getName() != null && !donor.getName().trim().isEmpty()
            && donor.getPhoneNumber() != null && !donor.getPhoneNumber().trim().isEmpty()
            && donor.getAddress() != null && !donor.getAddress().trim().isEmpty();
        
        donor.setProfileComplete(profileComplete);
        donorRepository.save(donor);
        return profileComplete;
    }

    public boolean updateRecipientProfile(String email, Map<String, Object> updates) {
        Optional<Recipient> recipientOpt = recipientRepository.findByEmail(email);
        if (recipientOpt.isEmpty()) return false;
        Recipient recipient = recipientOpt.get();
        if (updates.containsKey("name")) recipient.setName((String) updates.get("name"));
        if (updates.containsKey("organizationName")) recipient.setOrganizationName((String) updates.get("organizationName"));
        if (updates.containsKey("licenseNumber")) recipient.setLicenseNumber((String) updates.get("licenseNumber"));
        if (updates.containsKey("phoneNumber")) recipient.setPhoneNumber((String) updates.get("phoneNumber"));
        if (updates.containsKey("address")) recipient.setAddress((String) updates.get("address"));
        if (updates.containsKey("profilePicture")) recipient.setProfilePicture((String) updates.get("profilePicture"));
        boolean profileComplete = recipient.getName() != null && !recipient.getName().trim().isEmpty()
            && recipient.getOrganizationName() != null && !recipient.getOrganizationName().trim().isEmpty()
            && recipient.getLicenseNumber() != null && !recipient.getLicenseNumber().trim().isEmpty();
        recipient.setProfileComplete(profileComplete);
        recipientRepository.save(recipient);
        return profileComplete;
    }
} 