package com.example.ecomm.repository;

import com.example.ecomm.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProduct_IdOrderByCreatedAtDesc(Long productId);

    @Query("select avg(r.rating) from Review r where r.product.id = :productId")
    Double getAverageRating(@Param("productId") Long productId);

    long countByProduct_Id(Long productId);
}