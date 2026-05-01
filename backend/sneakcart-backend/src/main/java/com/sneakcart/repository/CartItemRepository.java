package com.sneakcart.repository;

import com.sneakcart.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    // Find existing item by cart + product + size to avoid duplicates
    Optional<CartItem> findByCartIdAndProductIdAndSelectedSize(
        Long cartId, Long productId, String selectedSize
    );
}
