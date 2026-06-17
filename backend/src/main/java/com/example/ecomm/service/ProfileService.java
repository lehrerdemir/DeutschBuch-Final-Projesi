package com.example.ecomm.service;

import com.example.ecomm.model.UserProfile;
import com.example.ecomm.repository.UserProfileRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ProfileService {

    private final UserProfileRepository userProfileRepository;

    public ProfileService(UserProfileRepository userProfileRepository) {
        this.userProfileRepository = userProfileRepository;
    }

    public UserProfile getOrCreate(String uid, String email) {
        Optional<UserProfile> profileOpt = userProfileRepository.findByUserUid(uid);
        return profileOpt.orElseGet(() -> new UserProfile(uid, email, "", ""));
    }

    public UserProfile update(String uid, String email, String phone, String address) {
        UserProfile profile = userProfileRepository.findByUserUid(uid)
                .orElseGet(() -> new UserProfile(uid, email, "", ""));
        profile.setEmail(email);
        profile.setPhone(phone);
        profile.setAddress(address);
        return userProfileRepository.save(profile);
    }

    /**
     * Used during order confirmation: ensure profile exists and is up-to-date.
     */
    public void upsert(String uid, String email, String phone, String address) {
        if (uid == null || uid.isBlank()) return;
        update(uid, email, phone, address);
    }
}
