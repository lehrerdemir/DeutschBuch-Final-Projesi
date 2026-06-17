package com.example.ecomm.controller;

import com.example.ecomm.dto.ProductQuestionDTO;
import com.example.ecomm.security.FirebasePrincipal;
import com.example.ecomm.service.ProductQuestionService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/questions")
public class AdminQuestionController {
    private final ProductQuestionService questionService;

    public AdminQuestionController(ProductQuestionService questionService) {
        this.questionService = questionService;
    }

    @GetMapping
    public List<ProductQuestionDTO> listAll() {
        return questionService.listAllForAdmin();
    }

    @PutMapping("/{questionId}/answer")
    public ResponseEntity<ProductQuestionDTO> answer(@PathVariable Long questionId,
                                                     @Valid @RequestBody AnswerRequest req,
                                                     Authentication authentication) {
        String adminEmail = "admin";
        if (authentication != null && authentication.getPrincipal() instanceof FirebasePrincipal principal) {
            adminEmail = principal.getEmail();
        }
        return ResponseEntity.ok(questionService.answer(questionId, req.answerText, adminEmail));
    }

    public static class AnswerRequest {
        @NotBlank
        public String answerText;
    }
}
