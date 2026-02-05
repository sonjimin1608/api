package com.storeos.api.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import com.storeos.api.entity.PaymentMethod;

@Data
@NoArgsConstructor
public class CreateOrderRequest {
    private Long storeId;
    private Long userId;
    private Long tableId;
    private PaymentMethod paymentMethod;
}