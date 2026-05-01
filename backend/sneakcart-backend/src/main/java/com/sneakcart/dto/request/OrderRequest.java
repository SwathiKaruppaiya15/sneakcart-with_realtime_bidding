package com.sneakcart.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderRequest {
    @NotNull  private Long userId;
    @NotBlank private String addressLine;
    @NotBlank private String city;
    @NotBlank private String pinCode;
    @NotBlank private String phone;
    @NotNull  private String paymentMethod;  // "UPI" or "COD"
}
