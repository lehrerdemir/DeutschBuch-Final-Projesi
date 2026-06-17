package com.example.ecomm.service;

import com.example.ecomm.model.Product;
import com.example.ecomm.repository.ProductRepository;
import com.example.ecomm.service.exception.BadRequestException;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class PaymentService {

    private final ProductRepository productRepository;

    public PaymentService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public CreateIntentResponse createIntent(String stripeSecretKey, boolean demoPaymentEnabled, String currency, List<CartItem> items) throws StripeException {
        String cur = (currency == null || currency.isBlank()) ? "try" : currency.toLowerCase();
        long amount = computeAmountInCents(items);
        if (amount <= 0) throw new BadRequestException("Cart is empty or invalid");

        // Local classroom demo: keeps the order/payment flow testable without a Stripe account.
        // Real Stripe PaymentIntent code below remains available when app.demo-payment.enabled=false.
        if (demoPaymentEnabled) {
            return new CreateIntentResponse("demo_client_secret_" + System.currentTimeMillis(), amount, cur);
        }

        if (stripeSecretKey == null || stripeSecretKey.isBlank()) {
            throw new IllegalStateException("Missing stripe.secret-key");
        }
        Stripe.apiKey = stripeSecretKey;

        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amount)
                .setCurrency(cur)
                .setAutomaticPaymentMethods(
                        PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                .setEnabled(true)
                                .build()
                )
                .build();

        PaymentIntent intent = PaymentIntent.create(params);
        return new CreateIntentResponse(intent.getClientSecret(), amount, cur);
    }

    public long computeAmountInCents(List<CartItem> items) {
        if (items == null || items.isEmpty()) return 0;

        long total = 0;
        for (CartItem it : items) {
            if (it.productId == null || it.quantity <= 0) continue;
            Product p = productRepository.findById(it.productId)
                    .orElseThrow(() -> new BadRequestException("Product not found: " + it.productId));

            total += toCents(p.getPrice()) * it.quantity;
        }
        return total;
    }

    public long toCents(Double price) {
        return BigDecimal.valueOf(price == null ? 0.0 : price)
                .multiply(BigDecimal.valueOf(100))
                .setScale(0, RoundingMode.HALF_UP)
                .longValueExact();
    }

    public static class CartItem {
        public Long productId;
        public int quantity;
    }

    public record CreateIntentResponse(String clientSecret, long amount, String currency) {}
}
