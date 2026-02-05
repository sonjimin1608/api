package com.storeos.api.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AddItemRequest {
    private Long productId;
    private Integer quantity;
}