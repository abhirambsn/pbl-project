package com.abhirambsn.profileapi.controller;

import com.abhirambsn.profileapi.dto.CreateProfile;
import com.abhirambsn.profileapi.dto.JsonResponse;
import com.abhirambsn.profileapi.model.Profile;
import com.abhirambsn.profileapi.service.ProfileService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/health")
    public ResponseEntity<JsonResponse<String>> hello() {
        return JsonResponse.makeResponse(HttpStatus.OK, "Healthy", true);
    }

    @PostMapping
    public ResponseEntity<JsonResponse<String>> createProfile(@RequestBody CreateProfile createProfileBody) {
        String id = profileService.createProfile(createProfileBody);
        return JsonResponse.makeResponse(HttpStatus.CREATED, id, true);
    }

    @GetMapping
    public ResponseEntity<JsonResponse<Optional<Profile>>> getProfile(@RequestParam(name = "username", defaultValue = "me") String username, Authentication authentication) {
        Profile res = profileService.fetchProfile(username.equals("me") ? authentication.getName() : username);
        if (res == null) {
            return JsonResponse.makeResponse(HttpStatus.NOT_FOUND, null, false);
        }
        return JsonResponse.makeResponse(HttpStatus.OK, Optional.of(res), false);
    }
}
