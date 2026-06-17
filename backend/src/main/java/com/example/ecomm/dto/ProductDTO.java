package com.example.ecomm.dto;

public class ProductDTO {
    private Long id;
    private String name;
    private String author;
    private String publisher;
    private String level;
    private String category;
    private String description;
    private Double price;
    private String imageUrl;
    private boolean featured;
    private String details;
    private Integer stockQuantity;

    public ProductDTO() {}

    public ProductDTO(Long id, String name, String author, String publisher, String level, String category,
                      String description, Double price, String imageUrl, boolean featured,
                      String details, Integer stockQuantity) {
        this.id = id;
        this.name = name;
        this.author = author;
        this.publisher = publisher;
        this.level = level;
        this.category = category;
        this.description = description;
        this.price = price;
        this.imageUrl = imageUrl;
        this.featured = featured;
        this.details = details;
        this.stockQuantity = stockQuantity;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
    public String getPublisher() { return publisher; }
    public void setPublisher(String publisher) { this.publisher = publisher; }
    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public boolean isFeatured() { return featured; }
    public void setFeatured(boolean featured) { this.featured = featured; }
    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
    public Integer getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }
}
