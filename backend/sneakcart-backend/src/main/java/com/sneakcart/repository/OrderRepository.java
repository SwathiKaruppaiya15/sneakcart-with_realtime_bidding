package com.sneakcart.repository;

import com.sneakcart.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    // Returns orders newest first
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
}
