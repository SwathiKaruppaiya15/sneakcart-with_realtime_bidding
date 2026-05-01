package com.sneakcart.repository;

import com.sneakcart.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    // User order history — newest first
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);

    // All orders — newest first (admin)
    List<Order> findAllByOrderByCreatedAtDesc();

    // Total income (all time)
    @Query("SELECT COALESCE(SUM(o.totalPrice), 0) FROM Order o")
    Double getTotalIncome();

    // Income between two dates
    @Query("SELECT COALESCE(SUM(o.totalPrice), 0) FROM Order o WHERE o.createdAt BETWEEN :start AND :end")
    Double getIncomeBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    // Income grouped by month — returns [year, month, sum]
    @Query("SELECT YEAR(o.createdAt), MONTH(o.createdAt), SUM(o.totalPrice) " +
           "FROM Order o GROUP BY YEAR(o.createdAt), MONTH(o.createdAt) " +
           "ORDER BY YEAR(o.createdAt) DESC, MONTH(o.createdAt) DESC")
    List<Object[]> getMonthlyIncome();
}
