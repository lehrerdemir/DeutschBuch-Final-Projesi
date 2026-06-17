package com.example.ecomm.controller;

import com.example.ecomm.dto.ProductDTO;
import com.example.ecomm.service.AdminProductService;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/admin/products")
public class AdminProductController {

    private final AdminProductService adminProductService;

    public AdminProductController(AdminProductService adminProductService) {
        this.adminProductService = adminProductService;
    }

    @GetMapping
    public List<ProductDTO> listAll() {
        return adminProductService.listAll();
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductDTO> create(
            @RequestParam @NotBlank String name,
            @RequestParam(required = false) String author,
            @RequestParam(required = false) String publisher,
            @RequestParam(required = false) String level,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String description,
            @RequestParam Double price,
            @RequestParam(defaultValue = "false") boolean featured,
            @RequestParam(required = false) String details,
            @RequestParam(defaultValue = "0") Integer stockQuantity,
            @RequestPart(required = false) MultipartFile image
    ) throws Exception {
        return ResponseEntity.ok(
                adminProductService.create(name, author, publisher, level, category, description, price, featured, details, stockQuantity, image)
        );
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductDTO> update(
            @PathVariable Long id,
            @RequestParam @NotBlank String name,
            @RequestParam(required = false) String author,
            @RequestParam(required = false) String publisher,
            @RequestParam(required = false) String level,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String description,
            @RequestParam Double price,
            @RequestParam(defaultValue = "false") boolean featured,
            @RequestParam(required = false) String details,
            @RequestParam(defaultValue = "0") Integer stockQuantity,
            @RequestPart(required = false) MultipartFile image
    ) throws Exception {
        return ResponseEntity.ok(
                adminProductService.update(id, name, author, publisher, level, category, description, price, featured, details, stockQuantity, image)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        adminProductService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
