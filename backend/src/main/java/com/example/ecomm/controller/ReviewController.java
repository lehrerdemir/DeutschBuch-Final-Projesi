package com.example.ecomm.controller;

import com.example.ecomm.dto.ReviewDTO;
import com.example.ecomm.security.FirebasePrincipal;
import com.example.ecomm.service.ReviewService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/{productId}/reviews")
    public List<ReviewDTO> list(@PathVariable Long productId) {
        return reviewService.listByProduct(productId);
    }

    @PostMapping("/{productId}/reviews")
    public ResponseEntity<ReviewDTO> create(
            @PathVariable Long productId,
            @Valid @RequestBody CreateReviewRequest req,
            Authentication authentication
    ) {
        if (authentication == null || !(authentication.getPrincipal() instanceof FirebasePrincipal principal)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication required");
        }

        ReviewDTO saved = reviewService.create(
                productId,
                principal.getUid(),
                principal.getEmail(),
                principal.getName(),
                req.rating,
                req.comment
        );
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{productId}/rating")
    public RatingSummary rating(@PathVariable Long productId) {
        ReviewService.RatingSummary s = reviewService.ratingSummary(productId);
        return new RatingSummary(s.average(), s.count());
    }

    public static class CreateReviewRequest {
        @Min(1) @Max(5)
        public int rating;
        @NotBlank
        public String comment;
    }

    public record RatingSummary(double average, long count) {}

}
