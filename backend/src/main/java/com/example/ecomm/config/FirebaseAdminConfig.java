package com.example.ecomm.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct;
import java.io.FileInputStream;
import java.io.InputStream;

/**
 * Initializes Firebase Admin SDK so the backend can verify Firebase ID tokens.
 *
 * You must provide a service account JSON file path via:
 *   firebase.service-account-file=C:/path/to/serviceAccountKey.json
 *
 * (Or on Linux/macOS: /path/to/serviceAccountKey.json)
 */
@Configuration
public class FirebaseAdminConfig {

    @Value("${firebase.service-account-file:}")
    private String serviceAccountFile;

    @PostConstruct
    public void init() {
        // Allow running without Firebase config (e.g., during early development)
        if (serviceAccountFile == null || serviceAccountFile.isBlank()) {
            return;
        }

        if (!FirebaseApp.getApps().isEmpty()) {
            return;
        }

        try (InputStream in = new FileInputStream(serviceAccountFile)) {
            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(in))
                    .build();
            FirebaseApp.initializeApp(options);
        } catch (Exception e) {
            throw new RuntimeException("Failed to initialize Firebase Admin SDK. Check firebase.service-account-file.", e);
        }
    }
}
