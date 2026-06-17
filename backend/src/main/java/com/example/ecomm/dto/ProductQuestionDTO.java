package com.example.ecomm.dto;

import java.time.Instant;

public class ProductQuestionDTO {
    private Long id;
    private Long productId;
    private String productName;
    private String userName;
    private String userEmail;
    private String questionText;
    private String answerText;
    private String answeredBy;
    private Instant createdAt;
    private Instant updatedAt;

    public ProductQuestionDTO() {}

    public ProductQuestionDTO(Long id, Long productId, String productName, String userName, String userEmail,
                              String questionText, String answerText, String answeredBy, Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.productId = productId;
        this.productName = productName;
        this.userName = userName;
        this.userEmail = userEmail;
        this.questionText = questionText;
        this.answerText = answerText;
        this.answeredBy = answeredBy;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() { return id; }
    public Long getProductId() { return productId; }
    public String getProductName() { return productName; }
    public String getUserName() { return userName; }
    public String getUserEmail() { return userEmail; }
    public String getQuestionText() { return questionText; }
    public String getAnswerText() { return answerText; }
    public String getAnsweredBy() { return answeredBy; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
