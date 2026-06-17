package com.example.ecomm.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String userUid;

    private String userEmail;

    // Snapshot of contact/shipping info at the time of purchase
    private String phone;

    @Column(length = 2000)
    private String address;

    @Column(nullable = false)
    private long totalAmount; // cents

    @Column(nullable = false)
    private String currency;

    @Column(nullable = false)
    private String paymentIntentId;

    /**
     * Payment status.
     *
     * NOTE: mapped to the legacy column name "status" to avoid breaking existing DBs.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private PaymentStatus paymentStatus;

    /**
     * Business order status (shipping / lifecycle).
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "order_status")
    private OrderStatus orderStatus;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    public Order() {}

    public Order(String userUid, String userEmail, String phone, String address,
                 long totalAmount, String currency, String paymentIntentId,
                 PaymentStatus paymentStatus, OrderStatus orderStatus) {
        this.userUid = userUid;
        this.userEmail = userEmail;
        this.phone = phone;
        this.address = address;
        this.totalAmount = totalAmount;
        this.currency = currency;
        this.paymentIntentId = paymentIntentId;
        this.paymentStatus = paymentStatus;
        this.orderStatus = orderStatus;
    }

    @PrePersist
    public void prePersist() {
        if (paymentStatus == null) paymentStatus = PaymentStatus.PAID;
        if (orderStatus == null) orderStatus = OrderStatus.NEW_ORDER;
    }

    public Long getId() { return id; }
    public String getUserUid() { return userUid; }
    public String getUserEmail() { return userEmail; }
    public String getPhone() { return phone; }
    public String getAddress() { return address; }
    public long getTotalAmount() { return totalAmount; }
    public String getCurrency() { return currency; }
    public String getPaymentIntentId() { return paymentIntentId; }
    public PaymentStatus getPaymentStatus() { return paymentStatus; }
    public OrderStatus getOrderStatus() { return orderStatus; }
    public Instant getCreatedAt() { return createdAt; }
    public List<OrderItem> getItems() { return items; }

    public void setOrderStatus(OrderStatus orderStatus) {
        this.orderStatus = orderStatus;
    }

    public void addItem(OrderItem item) {
        items.add(item);
        item.setOrder(this);
    }
}
