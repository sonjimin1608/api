package com.storeos.api.dto;

import com.storeos.api.entity.ProductStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {
    private Long productId;
    private String productName;
    private Integer productPrice;
    private ProductStatus productStatus;
    private Long categoryId;
}
