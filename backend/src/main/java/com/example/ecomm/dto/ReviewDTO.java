package com.example.ecomm.dto;

import java.time.Instant;

public class ReviewDTO {
    private Long id;
    private Long productId;
    private String userName;
    private String userEmail;
    private int rating;
    private String comment;
    private Instant createdAt;

    public ReviewDTO() {}

    public ReviewDTO(Long id, Long productId, String userName, String userEmail,
                     int rating, String comment, Instant createdAt) {
        this.id = id;
        this.productId = productId;
        this.userName = userName;
        this.userEmail = userEmail;
        this.rating = rating;
        this.comment = comment;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
