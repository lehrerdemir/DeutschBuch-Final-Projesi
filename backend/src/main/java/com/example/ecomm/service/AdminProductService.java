package com.example.ecomm.service;

import com.example.ecomm.dto.ProductDTO;
import com.example.ecomm.model.Product;
import com.example.ecomm.repository.ProductRepository;
import com.example.ecomm.service.exception.NotFoundException;
import com.example.ecomm.service.mapper.DtoMapper;
import jakarta.validation.constraints.NotBlank;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class AdminProductService {

    private final ProductRepository productRepository;
    private final FileStorageService fileStorageService;

    public AdminProductService(ProductRepository productRepository, FileStorageService fileStorageService) {
        this.productRepository = productRepository;
        this.fileStorageService = fileStorageService;
    }

    public List<ProductDTO> listAll() {
        return productRepository.findAllByOrderByIdAsc().stream().map(DtoMapper::toDto).toList();
    }

    public ProductDTO create(
            @NotBlank String name,
            String author,
            String publisher,
            String level,
            String category,
            String description,
            Double price,
            boolean featured,
            String details,
            Integer stockQuantity,
            MultipartFile image
    ) throws Exception {

        String imageUrl = (image != null && !image.isEmpty())
                ? fileStorageService.saveProductImage(image)
                : null;

        Product p = new Product(name, author, publisher, level, category, description, price, imageUrl, featured, details, stockQuantity);
        Product saved = productRepository.save(p);
        return DtoMapper.toDto(saved);
    }

    public ProductDTO update(
            Long id,
            @NotBlank String name,
            String author,
            String publisher,
            String level,
            String category,
            String description,
            Double price,
            boolean featured,
            String details,
            Integer stockQuantity,
            MultipartFile image
    ) throws Exception {

        Product p = productRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Product not found: " + id));

        p.setName(name);
        p.setAuthor(author);
        p.setPublisher(publisher);
        p.setLevel(level);
        p.setCategory(category);
        p.setDescription(description);
        p.setPrice(price);
        p.setFeatured(featured);
        p.setDetails(details);
        p.setStockQuantity(stockQuantity);

        if (image != null && !image.isEmpty()) {
            p.setImageUrl(fileStorageService.saveProductImage(image));
        }

        Product saved = productRepository.save(p);
        return DtoMapper.toDto(saved);
    }

    public void delete(Long id) {
        productRepository.deleteById(id);
    }
}
