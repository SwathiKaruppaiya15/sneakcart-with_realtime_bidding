package com.sneakcart.controller;

import com.sneakcart.dto.request.CartItemRequest;
import com.sneakcart.entity.Cart;
import com.sneakcart.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    // GET /api/cart/{userId}
    @GetMapping("/{userId}")
    public ResponseEntity<Cart> getCart(@PathVariable Long userId) {
        return ResponseEntity.ok(cartService.getOrCreateCart(userId));
    }

    // POST /api/cart/{userId}/items
    @PostMapping("/{userId}/items")
    public ResponseEntity<Cart> addItem(@PathVariable Long userId,
                                        @Valid @RequestBody CartItemRequest req) {
        return ResponseEntity.ok(cartService.addItem(userId, req));
    }

    // DELETE /api/cart/{userId}/items/{cartItemId}
    @DeleteMapping("/{userId}/items/{cartItemId}")
    public ResponseEntity<Cart> removeItem(@PathVariable Long userId,
                                           @PathVariable Long cartItemId) {
        return ResponseEntity.ok(cartService.removeItem(userId, cartItemId));
    }

    // PATCH /api/cart/{userId}/items/{cartItemId}
    @PatchMapping("/{userId}/items/{cartItemId}")
    public ResponseEntity<Cart> updateQuantity(@PathVariable Long userId,
                                               @PathVariable Long cartItemId,
                                               @RequestBody Map<String, Integer> body) {
        int qty = body.getOrDefault("quantity", 1);
        return ResponseEntity.ok(cartService.updateQuantity(userId, cartItemId, qty));
    }

    // DELETE /api/cart/{userId}/clear
    @DeleteMapping("/{userId}/clear")
    public ResponseEntity<Void> clearCart(@PathVariable Long userId) {
        cartService.clearCart(userId);
        return ResponseEntity.noContent().build();
    }
}
