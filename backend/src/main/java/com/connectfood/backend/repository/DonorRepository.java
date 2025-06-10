package com.connectfood.backend.repository;

import com.connectfood.backend.model.Donor;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface DonorRepository extends MongoRepository<Donor, String> {
    Optional<Donor> findByEmail(String email);
}
