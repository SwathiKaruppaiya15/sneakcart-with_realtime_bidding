package com.sneakcart.product.repository;

import com.sneakcart.product.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByIsAuction(Boolean isAuction);

    @Query("SELECT p FROM Product p WHERE " +
           "(:color IS NULL OR p.color = :color) AND " +
           "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR p.price <= :maxPrice)")
    List<Product> filter(
        @Param("color")    String color,
        @Param("minPrice") Long minPrice,
        @Param("maxPrice") Long maxPrice
    );
}
