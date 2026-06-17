package com.example.ecomm.repository;

import com.example.ecomm.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // All featured products, newest first
    List<Product> findByFeaturedTrueOrderByIdDesc();

    List<Product> findAllByOrderByIdAsc();

    // You can still add other methods here if needed
}
