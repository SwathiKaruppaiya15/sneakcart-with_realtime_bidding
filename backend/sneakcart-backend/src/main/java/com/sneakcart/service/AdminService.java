package com.sneakcart.service;

import com.sneakcart.dto.response.AnalyticsResponse;
import com.sneakcart.entity.Order;
import com.sneakcart.entity.Product;
import com.sneakcart.exception.ResourceNotFoundException;
import com.sneakcart.repository.OrderRepository;
import com.sneakcart.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AdminService {

    private final OrderRepository   orderRepository;
    private final ProductRepository productRepository;

    public AdminService(OrderRepository orderRepository,
                        ProductRepository productRepository) {
        this.orderRepository   = orderRepository;
        this.productRepository = productRepository;
    }

    // ── ORDERS ──────────────────────────────────────────────────────────────

    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    public Order getOrderDetail(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));
    }

    // ── PRODUCTS / STOCK ────────────────────────────────────────────────────

    public List<Product> getAllProductsWithStock() {
        return productRepository.findAll();
    }

    @Transactional
    public Product updateStock(Long productId, Integer newStock) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + productId));
        product.setStock(newStock);
        return productRepository.save(product);
    }

    // ── ANALYTICS ───────────────────────────────────────────────────────────

    public AnalyticsResponse getAnalytics() {
        LocalDateTime now = LocalDateTime.now();

        Double totalIncome   = orZero(orderRepository.getTotalIncome());
        Double dailyIncome   = orZero(orderRepository.getIncomeBetween(now.toLocalDate().atStartOfDay(), now));
        Double weeklyIncome  = orZero(orderRepository.getIncomeBetween(now.minusDays(7), now));
        Double monthlyIncome = orZero(orderRepository.getIncomeBetween(now.withDayOfMonth(1).toLocalDate().atStartOfDay(), now));
        Double yearlyIncome  = orZero(orderRepository.getIncomeBetween(now.withDayOfYear(1).toLocalDate().atStartOfDay(), now));

        // Find highest income month
        List<Object[]> monthly = orderRepository.getMonthlyIncome();
        String highestMonth  = "N/A";
        Double highestIncome = 0.0;

        for (Object[] row : monthly) {
            int    year  = ((Number) row[0]).intValue();
            int    month = ((Number) row[1]).intValue();
            double sum   = ((Number) row[2]).doubleValue();
            if (sum > highestIncome) {
                highestIncome = sum;
                highestMonth  = year + "-" + String.format("%02d", month);
            }
        }

        return new AnalyticsResponse(
            totalIncome, dailyIncome, weeklyIncome,
            monthlyIncome, yearlyIncome,
            highestMonth, highestIncome
        );
    }

    private Double orZero(Double value) {
        return value != null ? value : 0.0;
    }
}
