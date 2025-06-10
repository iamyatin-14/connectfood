package com.connectfood.backend.repository;

import com.connectfood.backend.model.Donation;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface DonationRepository extends MongoRepository<Donation, String> {
    List<Donation> findByDonorEmail(String donorEmail);
    List<Donation> findByCollectedFalseAndCityContainingIgnoreCaseAndDistrictContainingIgnoreCaseAndQuantityGreaterThanEqual(
        String city, String district, int minQuantity);
    List<Donation> findByCollectedTrue();
    
    // Count methods for statistics
    long countByDonorEmail(String donorEmail);
    long countByDonorEmailAndCollectedFalse(String donorEmail);
    long countByCollectedTrue();
    long countByCollectedFalse();
}
