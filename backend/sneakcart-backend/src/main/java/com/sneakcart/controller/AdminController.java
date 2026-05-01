package com.sneakcart.controller;

import com.sneakcart.dto.request.StockUpdateRequest;
import com.sneakcart.dto.response.AnalyticsResponse;
import com.sneakcart.entity.Order;
import com.sneakcart.entity.Product;
import com.sneakcart.entity.User;
import com.sneakcart.exception.BadRequestException;
import com.sneakcart.repository.UserRepository;
import com.sneakcart.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService   adminService;
    private final UserRepository userRepository;

    public AdminController(AdminService adminService, UserRepository userRepository) {
        this.adminService   = adminService;
        this.userRepository = userRepository;
    }

    // ── Role guard helper ────────────────────────────────────────────────────
    // In production this would be a Spring Security filter.
    // Here we use a simple userId header check.
    private void requireAdmin(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BadRequestException("User not found"));
        if (user.getRole() != User.Role.ADMIN) {
            throw new BadRequestException("Access denied: ADMIN role required");
        }
    }

    // ── ORDERS ───────────────────────────────────────────────────────────────

    // GET /api/admin/orders?adminId=1
    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getAllOrders(@RequestParam Long adminId) {
        requireAdmin(adminId);
        return ResponseEntity.ok(adminService.getAllOrders());
    }

    // GET /api/admin/orders/{id}?adminId=1
    @GetMapping("/orders/{id}")
    public ResponseEntity<Order> getOrderDetail(@PathVariable Long id,
                                                @RequestParam Long adminId) {
        requireAdmin(adminId);
        return ResponseEntity.ok(adminService.getOrderDetail(id));
    }

    // ── PRODUCTS / STOCK ─────────────────────────────────────────────────────

    // GET /api/admin/products?adminId=1
    @GetMapping("/products")
    public ResponseEntity<List<Product>> getAllProducts(@RequestParam Long adminId) {
        requireAdmin(adminId);
        return ResponseEntity.ok(adminService.getAllProductsWithStock());
    }

    // PUT /api/admin/products/{id}/stock?adminId=1
    @PutMapping("/products/{id}/stock")
    public ResponseEntity<Product> updateStock(@PathVariable Long id,
                                               @RequestParam Long adminId,
                                               @Valid @RequestBody StockUpdateRequest req) {
        requireAdmin(adminId);
        return ResponseEntity.ok(adminService.updateStock(id, req.getStock()));
    }

    // ── ANALYTICS ────────────────────────────────────────────────────────────

    // GET /api/admin/analytics?adminId=1
    @GetMapping("/analytics")
    public ResponseEntity<AnalyticsResponse> getAnalytics(@RequestParam Long adminId) {
        requireAdmin(adminId);
        return ResponseEntity.ok(adminService.getAnalytics());
    }
}
