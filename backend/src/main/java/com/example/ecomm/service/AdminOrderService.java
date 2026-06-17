package com.example.ecomm.service;

import com.example.ecomm.dto.OrderDTO;
import com.example.ecomm.model.Order;
import com.example.ecomm.model.OrderStatus;
import com.example.ecomm.model.PaymentStatus;
import com.example.ecomm.repository.OrderRepository;
import com.example.ecomm.service.exception.NotFoundException;
import com.example.ecomm.service.mapper.DtoMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminOrderService {

    private final OrderRepository orderRepository;

    public AdminOrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public List<OrderDTO> list(String email, String phone, PaymentStatus paymentStatus, OrderStatus orderStatus) {
        return orderRepository.adminSearch(email, phone, paymentStatus, orderStatus)
                .stream()
                .map(DtoMapper::toDto)
                .toList();
    }

    public OrderDTO updateStatus(Long id, OrderStatus newStatus) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Order not found: " + id));
        order.setOrderStatus(newStatus);
        return DtoMapper.toDto(orderRepository.save(order));
    }
}
