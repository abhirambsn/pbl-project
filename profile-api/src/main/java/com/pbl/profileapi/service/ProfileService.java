package com.pbl.profileapi.service;

import com.pbl.profileapi.dto.CreateProfile;
import com.pbl.profileapi.model.Profile;
import com.pbl.profileapi.repository.ProfileRepository;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class ProfileService {
    private final ProfileRepository profileRepository;

    public ProfileService(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    public String createProfile(CreateProfile createProfileBody) {
        Profile newProfile = Profile.builder()
                .id(createProfileBody.getId())
                .profileImageUrl(createProfileBody.getProfileImageUrl())
                .knowledge_base_ids(Collections.emptyList()).build();

        profileRepository.save(newProfile);
        return newProfile.getId();
    }

    public Profile fetchProfile(String id) {
        return profileRepository.findById(id).orElse(null);
    }


}
