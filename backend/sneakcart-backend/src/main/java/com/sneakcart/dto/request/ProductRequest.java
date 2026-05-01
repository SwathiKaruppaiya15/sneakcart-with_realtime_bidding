package com.sneakcart.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductRequest {

    @NotBlank(message = "Product name is required")
    private String name;

    private String brand;

    @Positive(message = "Price must be positive")
    private Double price;

    private String color;
    private String sizes;
    private String badge;
    private String imageUrl;
    private Boolean isAuction = false;
}
