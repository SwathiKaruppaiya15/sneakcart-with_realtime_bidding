package com.sneakcart.order.service;

import com.sneakcart.order.model.Order;
import com.sneakcart.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository repo;

    public Order placeOrder(Order order) {
        order.setStatus(Order.OrderStatus.PROCESSING);
        return repo.save(order);
    }

    public List<Order> getHistory(String userId) {
        return repo.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Order getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found: " + id));
    }

    public Order updateStatus(Long id, Order.OrderStatus status) {
        Order order = getById(id);
        order.setStatus(status);
        return repo.save(order);
    }
}
