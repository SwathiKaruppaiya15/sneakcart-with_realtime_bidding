package com.sneakcart.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotBlank(message = "Address is required")
    private String addressLine;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "PIN code is required")
    private String pinCode;

    @NotBlank(message = "Phone is required")
    private String phone;

    @NotBlank(message = "Payment method is required")
    private String paymentMethod;
}
