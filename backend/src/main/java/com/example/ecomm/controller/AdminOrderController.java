package com.example.ecomm.controller;

import com.example.ecomm.dto.OrderDTO;
import com.example.ecomm.model.OrderStatus;
import com.example.ecomm.model.PaymentStatus;
import com.example.ecomm.service.AdminOrderService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Admin-only order management.
 * Security is enforced by SecurityConfig (/api/admin/** requires ROLE_ADMIN).
 */
@RestController
@RequestMapping("/api/admin/orders")
public class AdminOrderController {

    private final AdminOrderService adminOrderService;

    public AdminOrderController(AdminOrderService adminOrderService) {
        this.adminOrderService = adminOrderService;
    }

    /**
     * Filterable list of all orders.
     *
     * Default ordering: NEW_ORDER first, then newest first.
     */
    @GetMapping
    public ResponseEntity<List<OrderDTO>> list(
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String phone,
            @RequestParam(required = false) PaymentStatus paymentStatus,
            @RequestParam(required = false) OrderStatus orderStatus
    ) {

        return ResponseEntity.ok(adminOrderService.list(email, phone, paymentStatus, orderStatus));
    }

    /**
     * Update order status (shipping / lifecycle).
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<OrderDTO> updateStatus(@PathVariable Long id, @Valid @RequestBody UpdateStatusRequest req) {
        return ResponseEntity.ok(adminOrderService.updateStatus(id, req.orderStatus));
    }

    public static class UpdateStatusRequest {
        @NotNull
        public OrderStatus orderStatus;
    }
}
