package com.sneakcart.order.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String userId;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String itemsJson;       // JSON array of cart items

    @Column(nullable = false)
    private Long totalAmount;       // in rupees

    private String addressLine;
    private String city;
    private String pinCode;
    private String phone;

    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    private OrderStatus status = OrderStatus.PROCESSING;

    private LocalDateTime createdAt = LocalDateTime.now();

    public enum PaymentMethod { UPI, COD }
    public enum OrderStatus   { PROCESSING, SHIPPED, DELIVERED, CANCELLED }
}
