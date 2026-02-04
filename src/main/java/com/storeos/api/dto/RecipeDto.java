package com.storeos.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor // 기본 생성자 (나중에 JSON 변환할 때 필수)
public class RecipeDto {
    private Integer quantity;
    private Long ingredientId;
    private Long productId;
}
