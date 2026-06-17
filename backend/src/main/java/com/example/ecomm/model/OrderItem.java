package com.example.ecomm.model;

import jakarta.persistence.*;

@Entity
@Table(name = "order_items")
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(nullable = false)
    private Long productId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private long unitPrice; // cents

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false)
    private long lineTotal; // cents

    public OrderItem() {}

    public OrderItem(Long productId, String name, long unitPrice, int quantity) {
        this.productId = productId;
        this.name = name;
        this.unitPrice = unitPrice;
        this.quantity = quantity;
        this.lineTotal = unitPrice * quantity;
    }

    public Long getId() { return id; }
    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }

    public Long getProductId() { return productId; }
    public String getName() { return name; }
    public long getUnitPrice() { return unitPrice; }
    public int getQuantity() { return quantity; }
    public long getLineTotal() { return lineTotal; }
}
