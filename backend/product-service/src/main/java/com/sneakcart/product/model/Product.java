package com.sneakcart.product.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "products")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String brand;

    @Column(nullable = false)
    private Long price;          // in paise (INR * 100) or just rupees

    private String color;

    private String sizes;        // comma-separated: "7,8,9,10"

    private String badge;

    @Column(nullable = false)
    private Boolean isAuction = false;
}
