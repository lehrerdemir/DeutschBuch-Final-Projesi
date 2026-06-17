package com.example.ecomm.service;

import com.example.ecomm.dto.ProductQuestionDTO;
import com.example.ecomm.model.Product;
import com.example.ecomm.model.ProductQuestion;
import com.example.ecomm.repository.ProductQuestionRepository;
import com.example.ecomm.repository.ProductRepository;
import com.example.ecomm.service.exception.NotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductQuestionService {
    private final ProductQuestionRepository questionRepository;
    private final ProductRepository productRepository;

    public ProductQuestionService(ProductQuestionRepository questionRepository, ProductRepository productRepository) {
        this.questionRepository = questionRepository;
        this.productRepository = productRepository;
    }

    public List<ProductQuestionDTO> listByProduct(Long productId) {
        return questionRepository.findByProductIdOrderByCreatedAtDesc(productId).stream().map(this::toDto).toList();
    }

    public List<ProductQuestionDTO> listAllForAdmin() {
        return questionRepository.findAllByOrderByCreatedAtDesc().stream().map(this::toDto).toList();
    }

    public ProductQuestionDTO create(Long productId, String uid, String email, String name, String questionText) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("Product not found: " + productId));
        ProductQuestion q = new ProductQuestion(product, uid, email, name, questionText);
        return toDto(questionRepository.save(q));
    }

    public ProductQuestionDTO answer(Long questionId, String answerText, String adminEmail) {
        ProductQuestion q = questionRepository.findById(questionId)
                .orElseThrow(() -> new NotFoundException("Question not found: " + questionId));
        q.setAnswerText(answerText);
        q.setAnsweredBy(adminEmail);
        return toDto(questionRepository.save(q));
    }

    private ProductQuestionDTO toDto(ProductQuestion q) {
        return new ProductQuestionDTO(
                q.getId(),
                q.getProduct().getId(),
                q.getProduct().getName(),
                q.getUserName(),
                q.getUserEmail(),
                q.getQuestionText(),
                q.getAnswerText(),
                q.getAnsweredBy(),
                q.getCreatedAt(),
                q.getUpdatedAt()
        );
    }
}
