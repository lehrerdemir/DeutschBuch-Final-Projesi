package com.example.ecomm.controller;

import com.example.ecomm.model.UserProfile;
import com.example.ecomm.service.ProfileService;
import com.example.ecomm.security.FirebasePrincipal;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

/**
 * Stores user's contact/shipping details in DB.
 */
@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> me(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof FirebasePrincipal principal)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication required");
        }

        UserProfile profile = profileService.getOrCreate(principal.getUid(), principal.getEmail());
        return ResponseEntity.ok(new UserProfileResponse(profile.getEmail(), profile.getPhone(), profile.getAddress()));
    }

    @PutMapping("/me")
    public ResponseEntity<UserProfileResponse> updateMe(@Valid @RequestBody UpdateProfileRequest req, Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof FirebasePrincipal principal)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication required");
        }

        UserProfile saved = profileService.update(principal.getUid(), principal.getEmail(), req.phone, req.address);
        return ResponseEntity.ok(new UserProfileResponse(saved.getEmail(), saved.getPhone(), saved.getAddress()));
    }

    public record UserProfileResponse(String email, String phone, String address) {}

    public static class UpdateProfileRequest {
        @NotBlank
        public String phone;
        @NotBlank
        public String address;
    }
}
