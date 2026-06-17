package com.example.ecomm.repository;

import com.example.ecomm.model.ProductQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductQuestionRepository extends JpaRepository<ProductQuestion, Long> {
    List<ProductQuestion> findByProductIdOrderByCreatedAtDesc(Long productId);
    List<ProductQuestion> findAllByOrderByCreatedAtDesc();
}
