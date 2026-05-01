package com.sneakcart.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.*;

@Entity
@Table(name = "products")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
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

    private String sizes;       // comma-separated: "6,7,8,9,10"

    private String badge;       // "New", "Hot", "Sale", "Trending"

    @Column(length = 1000)
    private String imageUrl;

    @Column(nullable = false)
    private Boolean isAuction = false;
}
