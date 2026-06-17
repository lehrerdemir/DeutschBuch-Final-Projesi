package com.example.ecomm.service;

import com.example.ecomm.dto.ProductDTO;
import com.example.ecomm.model.Product;
import com.example.ecomm.repository.ProductRepository;
import com.example.ecomm.service.exception.NotFoundException;
import com.example.ecomm.service.mapper.DtoMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository repository;

    public ProductService(ProductRepository repository) {
        this.repository = repository;
    }

    public List<ProductDTO> getTopFeatured() {
        // Business rule: return featured products ordered newest-first
        return repository.findByFeaturedTrueOrderByIdDesc()
                .stream()
                .map(DtoMapper::toDto)
                .toList();
    }

    public List<ProductDTO> getAllProducts() {
        return repository.findAll()
                .stream()
                .map(DtoMapper::toDto)
                .toList();
    }

    public ProductDTO getProductById(Long id) {
        Product p = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Product not found: " + id));
        return DtoMapper.toDto(p);
    }
}
