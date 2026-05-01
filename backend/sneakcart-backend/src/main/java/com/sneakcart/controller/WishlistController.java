package com.sneakcart.controller;

import com.sneakcart.entity.Wishlist;
import com.sneakcart.service.WishlistService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Wishlist>> getWishlist(@PathVariable Long userId) {
        return ResponseEntity.ok(wishlistService.getWishlist(userId));
    }

    @PostMapping("/{userId}/products/{productId}")
    public ResponseEntity<Wishlist> add(@PathVariable Long userId,
                                        @PathVariable Long productId) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(wishlistService.addToWishlist(userId, productId));
    }

    @DeleteMapping("/{userId}/products/{productId}")
    public ResponseEntity<Map<String, String>> remove(@PathVariable Long userId,
                                                      @PathVariable Long productId) {
        wishlistService.removeFromWishlist(userId, productId);
        return ResponseEntity.ok(Map.of("message", "Removed from wishlist"));
    }
}
