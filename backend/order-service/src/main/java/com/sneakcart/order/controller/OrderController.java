package com.sneakcart.order.controller;

import com.sneakcart.order.model.Order;
import com.sneakcart.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    private final OrderService service;

    @PostMapping
    public ResponseEntity<Order> place(@RequestBody Order order) {
        return ResponseEntity.ok(service.placeOrder(order));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> history(@PathVariable String userId) {
        return ResponseEntity.ok(service.getHistory(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Order> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        Order.OrderStatus status = Order.OrderStatus.valueOf(body.get("status"));
        return ResponseEntity.ok(service.updateStatus(id, status));
    }
}
