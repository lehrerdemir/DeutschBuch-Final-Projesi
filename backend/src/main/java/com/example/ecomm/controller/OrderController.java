package com.example.ecomm.controller;

import com.example.ecomm.dto.OrderDTO;
import com.example.ecomm.security.FirebasePrincipal;
import com.stripe.exception.StripeException;
import com.example.ecomm.service.OrderService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;

    @Value("${stripe.secret-key:}")
    private String stripeSecretKey;

    @Value("${app.demo-payment.enabled:false}")
    private boolean demoPaymentEnabled;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping("/me")
    public ResponseEntity<List<OrderDTO>> myOrders(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof FirebasePrincipal principal)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication required");
        }
        return ResponseEntity.ok(orderService.getMyOrders(principal.getUid()));
    }

    /**
     * Called by frontend AFTER Stripe confirms payment.
     * For a production system, you'd typically also use a Stripe webhook.
     */
    @PostMapping("/confirm")
    public ResponseEntity<OrderDTO> confirm(@Valid @RequestBody ConfirmOrderRequest req, Authentication authentication) throws StripeException {
        if (authentication == null || !(authentication.getPrincipal() instanceof FirebasePrincipal principal)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication required");
        }

        OrderDTO dto = orderService.confirmPaidOrder(
                stripeSecretKey,
                demoPaymentEnabled,
                principal.getUid(),
                principal.getEmail(),
                principal.getName(),
                req.paymentIntentId,
                req.phone,
                req.address,
                req.items.stream().map(it -> {
                    OrderService.CartItem ci = new OrderService.CartItem();
                    ci.productId = it.productId;
                    ci.quantity = it.quantity;
                    return ci;
                }).toList()
        );

        return ResponseEntity.ok(dto);
    }

    public static class ConfirmOrderRequest {
        @NotBlank
        public String paymentIntentId;

        @NotBlank
        public String phone;

        @NotBlank
        public String address;

        @NotNull
        public List<CartItem> items;
    }

    public static class CartItem {
        @NotNull
        public Long productId;
        @Min(1)
        public int quantity;
    }
}
