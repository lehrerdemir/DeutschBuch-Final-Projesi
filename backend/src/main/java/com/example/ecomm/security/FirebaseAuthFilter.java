package com.example.ecomm.security;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.*;

/**
 * Verifies Firebase ID tokens (Authorization: Bearer <token>) and creates a Spring Security Authentication.
 *
 * Roles:
 *  - ROLE_ADMIN if token has custom claim { admin: true } OR email is in app.admin.emails
 *  - ROLE_USER otherwise
 *
 * Local demo mode:
 *  - app.demo-auth.enabled=true allows X-Demo-User-Email headers for classroom/local testing.
 *  - Real Firebase verification code is still present and used when a Bearer token is provided.
 */
public class FirebaseAuthFilter extends OncePerRequestFilter {

    private final Set<String> adminEmails;
    private final boolean demoAuthEnabled;

    public FirebaseAuthFilter(String adminEmailsCsv, boolean demoAuthEnabled) {
        this.adminEmails = parseAdminEmails(adminEmailsCsv);
        this.demoAuthEnabled = demoAuthEnabled;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        if (demoAuthEnabled && tryDemoAuthentication(request)) {
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                FirebaseToken decoded = FirebaseAuth.getInstance().verifyIdToken(token);
                String uid = decoded.getUid();
                String email = (String) decoded.getClaims().getOrDefault("email", decoded.getEmail());
                String name = (String) decoded.getClaims().getOrDefault("name", "");
                boolean isAdmin = isAdmin(decoded, email);
                setAuthentication(request, new FirebasePrincipal(uid, email, name, isAdmin), isAdmin);
            } catch (Exception ignored) {
                // Invalid token: don't set authentication (security rules will block protected endpoints)
                SecurityContextHolder.clearContext();
            }
        }

        filterChain.doFilter(request, response);
    }

    private boolean tryDemoAuthentication(HttpServletRequest request) {
        String email = trimToNull(request.getHeader("X-Demo-User-Email"));
        if (email == null) return false;

        String uid = trimToNull(request.getHeader("X-Demo-User-Uid"));
        if (uid == null) {
            uid = "demo-" + Base64.getUrlEncoder().withoutPadding()
                    .encodeToString(email.toLowerCase(Locale.ROOT).getBytes(StandardCharsets.UTF_8));
        }
        String name = Optional.ofNullable(trimToNull(request.getHeader("X-Demo-User-Name"))).orElse("Demo Kullanıcı");
        boolean requestedAdmin = Boolean.parseBoolean(Optional.ofNullable(request.getHeader("X-Demo-Admin")).orElse("false"));
        boolean isAdmin = requestedAdmin || adminEmails.contains(email.toLowerCase(Locale.ROOT));

        setAuthentication(request, new FirebasePrincipal(uid, email, name, isAdmin), isAdmin);
        return true;
    }

    private void setAuthentication(HttpServletRequest request, FirebasePrincipal principal, boolean isAdmin) {
        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
        if (isAdmin) authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(principal, null, authorities);
        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    private boolean isAdmin(FirebaseToken token, String email) {
        Object adminClaim = token.getClaims().get("admin");
        if (adminClaim instanceof Boolean && (Boolean) adminClaim) return true;

        Object roleClaim = token.getClaims().get("role");
        if (roleClaim instanceof String && ((String) roleClaim).equalsIgnoreCase("admin")) return true;

        if (email == null || email.isBlank()) return false;
        return adminEmails.contains(email.toLowerCase(Locale.ROOT));
    }

    private Set<String> parseAdminEmails(String csv) {
        if (csv == null || csv.isBlank()) return Collections.emptySet();
        Set<String> set = new HashSet<>();
        for (String part : csv.split(",")) {
            String e = part.trim().toLowerCase(Locale.ROOT);
            if (!e.isBlank()) set.add(e);
        }
        return set;
    }

    private String trimToNull(String value) {
        if (value == null) return null;
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
