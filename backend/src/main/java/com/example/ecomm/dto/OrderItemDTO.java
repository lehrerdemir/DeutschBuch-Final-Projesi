package com.example.ecomm.dto;

public class OrderItemDTO {
    private Long productId;
    private String name;
    private long unitPrice;
    private int quantity;
    private long lineTotal;

    public OrderItemDTO() {}

    public OrderItemDTO(Long productId, String name, long unitPrice, int quantity, long lineTotal) {
        this.productId = productId;
        this.name = name;
        this.unitPrice = unitPrice;
        this.quantity = quantity;
        this.lineTotal = lineTotal;
    }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public long getUnitPrice() { return unitPrice; }
    public void setUnitPrice(long unitPrice) { this.unitPrice = unitPrice; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    public long getLineTotal() { return lineTotal; }
    public void setLineTotal(long lineTotal) { this.lineTotal = lineTotal; }
}
