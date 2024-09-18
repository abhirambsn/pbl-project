package com.abhirambsn.profileapi.controller;

import com.abhirambsn.profileapi.dto.CreateProfile;
import com.abhirambsn.profileapi.dto.JsonResponse;
import com.abhirambsn.profileapi.model.Profile;
import com.abhirambsn.profileapi.service.ProfileService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/profile")
public class ProfileController {

    private final ProfileService profileService;
    private static final Logger LOG = LogManager.getLogger(ProfileController.class);

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/health")
    public ResponseEntity<JsonResponse<String>> hello() {
        LOG.info("Requested health check");
        return JsonResponse.makeResponse(HttpStatus.OK, "Healthy", true);
    }

    @PostMapping
    public ResponseEntity<JsonResponse<String>> createProfile(@RequestBody CreateProfile createProfileBody) {
        String id = profileService.createProfile(createProfileBody);
        LOG.info("Profile created with id: {}", id);
        return JsonResponse.makeResponse(HttpStatus.CREATED, id, true);
    }

    @GetMapping
    public ResponseEntity<JsonResponse<Optional<Profile>>> getProfile(@RequestParam(name = "username", defaultValue = "me") String username) {
        Profile res = profileService.fetchProfile(username.equals("me") ? "myself" : username);
        if (res == null) {
            LOG.warn("Profile not found for username: {}", username);
            return JsonResponse.makeResponse(HttpStatus.NOT_FOUND, null, false);
        }
        LOG.info("Profile fetched for username: {}", username);
        return JsonResponse.makeResponse(HttpStatus.OK, Optional.of(res), false);
    }
}
