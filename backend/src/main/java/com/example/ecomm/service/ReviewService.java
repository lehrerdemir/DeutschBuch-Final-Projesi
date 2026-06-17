package com.example.ecomm.service;

import com.example.ecomm.dto.ReviewDTO;
import com.example.ecomm.model.Product;
import com.example.ecomm.model.Review;
import com.example.ecomm.repository.ProductRepository;
import com.example.ecomm.repository.ReviewRepository;
import com.example.ecomm.service.exception.BadRequestException;
import com.example.ecomm.service.exception.NotFoundException;
import com.example.ecomm.service.mapper.DtoMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    private final ProductRepository productRepository;
    private final ReviewRepository reviewRepository;

    public ReviewService(ProductRepository productRepository, ReviewRepository reviewRepository) {
        this.productRepository = productRepository;
        this.reviewRepository = reviewRepository;
    }

    public List<ReviewDTO> listByProduct(Long productId) {
        return reviewRepository.findByProduct_IdOrderByCreatedAtDesc(productId)
                .stream()
                .map(DtoMapper::toDto)
                .toList();
    }

    public ReviewDTO create(Long productId, String userUid, String userEmail, String userName, int rating, String comment) {
        if (rating < 1 || rating > 5) {
            throw new BadRequestException("Rating must be between 1 and 5");
        }
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("Product not found: " + productId));

        Review review = new Review(
                product,
                userUid,
                userEmail,
                userName,
                rating,
                comment
        );

        Review saved = reviewRepository.save(review);
        return DtoMapper.toDto(saved);
    }

    public RatingSummary ratingSummary(Long productId) {
        Double avg = reviewRepository.getAverageRating(productId);
        long count = reviewRepository.countByProduct_Id(productId);
        return new RatingSummary(avg == null ? 0.0 : avg, count);
    }

    public record RatingSummary(double average, long count) {}
}
