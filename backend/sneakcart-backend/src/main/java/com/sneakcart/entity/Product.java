package com.sneakcart.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.*;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Product name is required")
    @Column(nullable = false)
    private String name;

    private String brand;

    @Positive(message = "Price must be positive")
    @Column(nullable = false)
    private Double price;

    private String color;
    private String sizes;
    private String badge;

    @Column(length = 1000)
    private String imageUrl;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isAuction = false;

    // Stock management
    @Min(value = 0, message = "Stock cannot be negative")
    @Column(nullable = false)
    @Builder.Default
    private Integer stock = 0;
}
