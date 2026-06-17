package com.example.ecomm.controller;

import com.example.ecomm.service.PaymentService;
import com.stripe.exception.StripeException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    @Value("${stripe.secret-key:}")
    private String stripeSecretKey;

    @Value("${app.demo-payment.enabled:false}")
    private boolean demoPaymentEnabled;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create-intent")
    public CreateIntentResponse createIntent(@Valid @RequestBody CreateIntentRequest req) throws StripeException {
        PaymentService.CreateIntentResponse r = paymentService.createIntent(
                stripeSecretKey,
                demoPaymentEnabled,
                req.currency,
                req.items.stream().map(it -> {
                    PaymentService.CartItem ci = new PaymentService.CartItem();
                    ci.productId = it.productId;
                    ci.quantity = it.quantity;
                    return ci;
                }).toList()
        );

        return new CreateIntentResponse(r.clientSecret(), r.amount(), r.currency());
    }

    public static class CreateIntentRequest {
        public String currency = "try";
        @NotNull
        public List<CartItem> items;
    }

    public static class CartItem {
        @NotNull
        public Long productId;
        @Min(1)
        public int quantity;
    }

    public record CreateIntentResponse(String clientSecret, long amount, String currency) {}
}
