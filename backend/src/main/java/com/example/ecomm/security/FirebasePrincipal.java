package com.example.ecomm.security;

/**
 * Minimal user info extracted from a verified Firebase ID token.
 * Stored as the Spring Security principal.
 */
public class FirebasePrincipal {
    private final String uid;
    private final String email;
    private final String name;
    private final boolean admin;

    public FirebasePrincipal(String uid, String email, String name, boolean admin) {
        this.uid = uid;
        this.email = email;
        this.name = name;
        this.admin = admin;
    }

    public String getUid() { return uid; }
    public String getEmail() { return email; }
    public String getName() { return name; }
    public boolean isAdmin() { return admin; }
}
