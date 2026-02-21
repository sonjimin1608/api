package com.storeos.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateIngredientRequest {
    private String ingredientName;
    private Double currentStock;
    private String unit;
}
