package com.example.ecomm.security;

import com.example.ecomm.api.ApiError;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Value("${app.admin.emails:}")
    private String adminEmails;

    @Value("${app.demo-auth.enabled:false}")
    private boolean demoAuthEnabled;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, ObjectMapper objectMapper) throws Exception {
        FirebaseAuthFilter firebaseAuthFilter = new FirebaseAuthFilter(adminEmails, demoAuthEnabled);

        http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(eh -> eh
                        .authenticationEntryPoint((request, response, authException) ->
                                writeError(objectMapper, request, response, 401, "Unauthorized", "Authentication required")
                        )
                        .accessDeniedHandler((request, response, accessDeniedException) ->
                                writeError(objectMapper, request, response, 403, "Forbidden", "Access denied")
                        )
                )
                .authorizeHttpRequests(auth -> auth
                        // Static images / uploads
                        .requestMatchers("/images/**", "/uploads/**").permitAll()

                        // Public product browsing
                        .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()

                        // Public reviews read
                        .requestMatchers(HttpMethod.GET, "/api/products/*/reviews").permitAll()

                        // Admin endpoints
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // Authenticated endpoints
                        .requestMatchers("/api/payments/**", "/api/orders/**", "/api/profile/**", "/api/me").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/products/*/reviews").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/products/*/questions").authenticated()

                        .anyRequest().permitAll()
                )
                .addFilterBefore(firebaseAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    private static void writeError(
            ObjectMapper objectMapper,
            HttpServletRequest request,
            HttpServletResponse response,
            int status,
            String error,
            String message
    ) {
        try {
            response.setStatus(status);
            response.setCharacterEncoding("UTF-8");
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            ApiError payload = ApiError.of(status, error, message, request.getRequestURI());
            objectMapper.writeValue(response.getOutputStream(), payload);
        } catch (Exception ignored) {
            // If writing JSON fails, there isn't much else we can do here.
        }
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource(
            @Value("${app.cors.allowed-origins:http://localhost:3000}") String originsCsv) {

        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(originsCsv.split(",")));
        // IMPORTANT: Admin order status updates use PATCH.
        // If PATCH is not allowed, the browser will block the request at the CORS preflight step.
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*") );
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
