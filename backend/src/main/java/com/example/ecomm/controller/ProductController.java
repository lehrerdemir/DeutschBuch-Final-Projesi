package com.example.ecomm.controller;

import com.example.ecomm.dto.ProductDTO;
import com.example.ecomm.service.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/top")
    public List<ProductDTO> getTopFeatured() {
        return productService.getTopFeatured();
    }

    @GetMapping
    public List<ProductDTO> getAll() {
        return productService.getAllProducts();
    }

    @GetMapping("/{id}")
    public ProductDTO getOne(@PathVariable Long id) {
        return productService.getProductById(id);
    }



}
