package com.sneakcart.controller;

import com.sneakcart.dto.request.OrderRequest;
import com.sneakcart.entity.Order;
import com.sneakcart.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<Order> placeOrder(@Valid @RequestBody OrderRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.placeOrder(req));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getHistory(@PathVariable Long userId) {
        return ResponseEntity.ok(orderService.getOrderHistory(userId));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getById(@PathVariable Long orderId) {
        return ResponseEntity.ok(orderService.getById(orderId));
    }

    @PatchMapping("/{orderId}/status")
    public ResponseEntity<Order> updateStatus(@PathVariable Long orderId,
                                              @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(orderService.updateStatus(orderId, body.get("status")));
    }
}
