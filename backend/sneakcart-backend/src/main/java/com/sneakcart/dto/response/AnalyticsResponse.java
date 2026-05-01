package com.sneakcart.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsResponse {
    private Double totalIncome;
    private Double dailyIncome;
    private Double weeklyIncome;
    private Double monthlyIncome;
    private Double yearlyIncome;
    private String highestMonth;   // e.g. "2026-04"
    private Double highestIncome;
}
