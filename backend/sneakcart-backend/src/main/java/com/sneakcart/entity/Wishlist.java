package com.sneakcart.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "wishlists",
       uniqueConstraints = @UniqueConstraint(
           name = "uk_user_product_wishlist",
           columnNames = {"user_id", "product_id"}
       ))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Wishlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // EAGER: always load product details with wishlist entry
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
}
