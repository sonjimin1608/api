package com.storeos.api.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.storeos.api.dto.AddItemRequest;
import com.storeos.api.dto.CreateOrderRequest;
import com.storeos.api.entity.PaymentMethod;
import com.storeos.api.service.OrderService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // 1. 주문 생성
    @PostMapping("/stores/{storeId}/orders") 
    public ResponseEntity<Long> createOrder(@PathVariable Long storeId,
                                            @RequestBody CreateOrderRequest dto) {
        dto.setStoreId(storeId);
        Long orderId = orderService.createOrder(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(orderId);
    }

    // 2. 주문에 상품 담기
    @PostMapping("/orders/{orderId}/orderDetail")
    public ResponseEntity<Void> addItemToOrder (@PathVariable Long orderId,
                                                @RequestBody AddItemRequest dto) {
        orderService.addItemToOrder(dto, orderId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // 3. 결제하기
    @PostMapping("/orders/{orderId}/payment") 
    public ResponseEntity<Void> payOrder (@PathVariable Long orderId,
                                          @RequestBody PaymentMethod paymentMethod) {
        
        orderService.payOrder(orderId, paymentMethod);
        

        return ResponseEntity.ok().build(); 
    }
}