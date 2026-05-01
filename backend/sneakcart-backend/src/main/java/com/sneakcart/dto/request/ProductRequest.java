package com.sneakcart.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class ProductRequest {
    @NotBlank private String name;
    private String brand;
    @Positive private Double price;
    private String color;
    private String sizes;
    private String badge;
    private String imageUrl;
    private Boolean isAuction = false;
}
