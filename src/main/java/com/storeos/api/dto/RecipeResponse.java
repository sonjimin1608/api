package com.storeos.api.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class RecipeResponse {
    private Long recipeId;
    private Integer quantity;
    private Long productId;
    private Long ingredientId;
}
