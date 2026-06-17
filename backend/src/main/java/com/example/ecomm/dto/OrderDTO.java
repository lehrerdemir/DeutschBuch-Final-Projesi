package com.example.ecomm.dto;

import java.time.Instant;
import java.util.List;

public class OrderDTO {
    private Long id;
    private String userEmail;
    private String phone;
    private String address;
    private String paymentStatus;
    private String orderStatus;
    private long totalAmount;
    private String currency;
    private Instant createdAt;
    private List<OrderItemDTO> items;

    public OrderDTO() {}

    public OrderDTO(Long id,
                    String userEmail,
                    String phone,
                    String address,
                    String paymentStatus,
                    String orderStatus,
                    long totalAmount,
                    String currency,
                    Instant createdAt,
                    List<OrderItemDTO> items) {
        this.id = id;
        this.userEmail = userEmail;
        this.phone = phone;
        this.address = address;
        this.paymentStatus = paymentStatus;
        this.orderStatus = orderStatus;
        this.totalAmount = totalAmount;
        this.currency = currency;
        this.createdAt = createdAt;
        this.items = items;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }
    public String getOrderStatus() { return orderStatus; }
    public void setOrderStatus(String orderStatus) { this.orderStatus = orderStatus; }
    public long getTotalAmount() { return totalAmount; }
    public void setTotalAmount(long totalAmount) { this.totalAmount = totalAmount; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public List<OrderItemDTO> getItems() { return items; }
    public void setItems(List<OrderItemDTO> items) { this.items = items; }
}
