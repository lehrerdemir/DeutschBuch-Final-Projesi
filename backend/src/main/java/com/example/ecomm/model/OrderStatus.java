package com.example.ecomm.model;

/**
 * Business status of an order (shipping / lifecycle).
 */
public enum OrderStatus {
    NEW_ORDER,
    SENT_OUT,
    RETURNED,
    COMPLETED
}
