package com.storeos.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.storeos.api.entity.PaymentMethod;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateOrderRequest {
    private Long storeId;
    private Long userId;
    private Long tableId;
    private PaymentMethod paymentMethod;
}