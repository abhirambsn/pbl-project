package com.abhirambsn.profileapi.repository;

import com.abhirambsn.profileapi.model.Profile;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfileRepository extends MongoRepository<Profile, String> { }
