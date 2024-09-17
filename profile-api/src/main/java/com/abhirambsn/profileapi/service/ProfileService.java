package com.abhirambsn.profileapi.service;

import com.abhirambsn.profileapi.dto.CreateProfile;
import com.abhirambsn.profileapi.model.Profile;
import com.abhirambsn.profileapi.repository.ProfileRepository;
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
