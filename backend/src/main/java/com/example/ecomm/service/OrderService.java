package com.example.ecomm.service;

import com.example.ecomm.dto.OrderDTO;
import com.example.ecomm.model.Order;
import com.example.ecomm.model.OrderItem;
import com.example.ecomm.model.OrderStatus;
import com.example.ecomm.model.PaymentStatus;
import com.example.ecomm.model.Product;
import com.example.ecomm.repository.OrderRepository;
import com.example.ecomm.repository.ProductRepository;
import com.example.ecomm.service.exception.BadRequestException;
import com.example.ecomm.service.exception.ConflictException;
import com.example.ecomm.service.exception.NotFoundException;
import com.example.ecomm.service.mapper.DtoMapper;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final ProfileService profileService;
    private final PaymentService paymentService;

    public OrderService(OrderRepository orderRepository,
                        ProductRepository productRepository,
                        ProfileService profileService,
                        PaymentService paymentService) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.profileService = profileService;
        this.paymentService = paymentService;
    }

    public List<OrderDTO> getMyOrders(String userUid) {
        return orderRepository.findByUserUidOrderByCreatedAtDesc(userUid)
                .stream()
                .map(DtoMapper::toDto)
                .toList();
    }

    /**
     * Confirm an order AFTER Stripe confirms payment.
     * For production, you typically also use a Stripe webhook.
     */
    public OrderDTO confirmPaidOrder(
            String stripeSecretKey,
            boolean demoPaymentEnabled,
            String userUid,
            String userEmail,
            String userName,
            String paymentIntentId,
            String phone,
            String address,
            List<CartItem> items
    ) throws StripeException {

        if (orderRepository.existsByPaymentIntentId(paymentIntentId)) {
            throw new ConflictException("Order already recorded for paymentIntentId=" + paymentIntentId);
        }

        long expectedAmount = computeAmountInCents(items);
        String currency = "try";

        if (demoPaymentEnabled && paymentIntentId != null && paymentIntentId.startsWith("demo_")) {
            // Classroom/local demo: accept a simulated successful payment.
            currency = "try";
        } else {
            if (stripeSecretKey == null || stripeSecretKey.isBlank()) {
                throw new IllegalStateException("Missing stripe.secret-key");
            }

            Stripe.apiKey = stripeSecretKey;
            PaymentIntent intent = PaymentIntent.retrieve(paymentIntentId);
            if (intent == null || intent.getStatus() == null || !intent.getStatus().equals("succeeded")) {
                throw new BadRequestException("Payment not successful");
            }
            if (intent.getAmount() == null || intent.getAmount() != expectedAmount) {
                throw new BadRequestException("Amount mismatch (possible client tampering)");
            }
            currency = intent.getCurrency();
        }

        // Save/refresh user profile in DB as well
        profileService.upsert(userUid, userEmail, phone, address);

        Order order = new Order(
                userUid,
                userEmail,
                phone,
                address,
                expectedAmount,
                currency,
                paymentIntentId,
                PaymentStatus.PAID,
                OrderStatus.NEW_ORDER
        );

        for (CartItem it : items) {
            Product p = productRepository.findById(it.productId)
                    .orElseThrow(() -> new NotFoundException("Product not found: " + it.productId));
            long unitPrice = paymentService.toCents(p.getPrice());
            order.addItem(new OrderItem(p.getId(), p.getName(), unitPrice, it.quantity));
        }

        Order saved = orderRepository.save(order);
        return DtoMapper.toDto(saved);
    }

    private long computeAmountInCents(List<CartItem> items) {
        // reuse safe conversion from PaymentService
        if (items == null || items.isEmpty()) return 0;
        long total = 0;
        for (CartItem it : items) {
            if (it.productId == null || it.quantity <= 0) continue;
            Product p = productRepository.findById(it.productId)
                    .orElseThrow(() -> new NotFoundException("Product not found: " + it.productId));
            total += paymentService.toCents(p.getPrice()) * it.quantity;
        }
        return total;
    }

    public static class CartItem {
        public Long productId;
        public int quantity;
    }
}
