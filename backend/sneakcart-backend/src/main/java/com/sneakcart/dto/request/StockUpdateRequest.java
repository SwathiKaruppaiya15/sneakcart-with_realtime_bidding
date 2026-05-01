package com.sneakcart.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StockUpdateRequest {

    @NotNull(message = "Stock value is required")
    @Min(value = 0, message = "Stock cannot be negative")
    private Integer stock;
}
