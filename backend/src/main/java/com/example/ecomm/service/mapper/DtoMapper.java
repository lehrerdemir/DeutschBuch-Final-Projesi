package com.example.ecomm.service.mapper;

import com.example.ecomm.dto.OrderDTO;
import com.example.ecomm.dto.OrderItemDTO;
import com.example.ecomm.dto.ProductDTO;
import com.example.ecomm.dto.ReviewDTO;
import com.example.ecomm.model.Order;
import com.example.ecomm.model.Product;
import com.example.ecomm.model.Review;

import java.util.List;

/**
 * Centralized entity -> DTO mapping.
 * Keeps controllers thin and avoids repeating mapping code in multiple services.
 */
public final class DtoMapper {

    private DtoMapper() {}

    public static ProductDTO toDto(Product p) {
        if (p == null) return null;
        return new ProductDTO(
                p.getId(),
                p.getName(),
                p.getAuthor(),
                p.getPublisher(),
                p.getLevel(),
                p.getCategory(),
                p.getDescription(),
                p.getPrice(),
                p.getImageUrl(),
                p.isFeatured(),
                p.getDetails(),
                p.getStockQuantity()
        );
    }

    public static ReviewDTO toDto(Review r) {
        if (r == null) return null;
        return new ReviewDTO(
                r.getId(),
                r.getProduct().getId(),
                r.getUserName(),
                r.getUserEmail(),
                r.getRating(),
                r.getComment(),
                r.getCreatedAt()
        );
    }

    public static OrderDTO toDto(Order o) {
        if (o == null) return null;
        List<OrderItemDTO> items = o.getItems().stream()
                .map(it -> new OrderItemDTO(
                        it.getProductId(),
                        it.getName(),
                        it.getUnitPrice(),
                        it.getQuantity(),
                        it.getLineTotal()
                ))
                .toList();

        return new OrderDTO(
                o.getId(),
                o.getUserEmail(),
                o.getPhone(),
                o.getAddress(),
                String.valueOf(o.getPaymentStatus()),
                String.valueOf(o.getOrderStatus()),
                o.getTotalAmount(),
                o.getCurrency(),
                o.getCreatedAt(),
                items
        );
    }
}
