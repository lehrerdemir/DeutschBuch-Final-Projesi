package com.example.ecomm.controller;

import com.example.ecomm.dto.ProductQuestionDTO;
import com.example.ecomm.security.FirebasePrincipal;
import com.example.ecomm.service.ProductQuestionService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductQuestionController {
    private final ProductQuestionService questionService;

    public ProductQuestionController(ProductQuestionService questionService) {
        this.questionService = questionService;
    }

    @GetMapping("/{productId}/questions")
    public List<ProductQuestionDTO> list(@PathVariable Long productId) {
        return questionService.listByProduct(productId);
    }

    @PostMapping("/{productId}/questions")
    public ResponseEntity<ProductQuestionDTO> create(@PathVariable Long productId,
                                                     @Valid @RequestBody CreateQuestionRequest req,
                                                     Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof FirebasePrincipal principal)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication required");
        }
        return ResponseEntity.ok(questionService.create(productId, principal.getUid(), principal.getEmail(), principal.getName(), req.questionText));
    }

    public static class CreateQuestionRequest {
        @NotBlank
        public String questionText;
    }
}
