package com.sneakcart.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BidRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Bid amount is required")
    @Positive(message = "Bid amount must be positive")
    private Double amount;
}
