package com.sneakcart.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class BidRequest {
    @NotNull private Long userId;
    @NotNull @Positive private Double amount;
}
