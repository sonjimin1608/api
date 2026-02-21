package com.storeos.api.service;

import com.storeos.api.dto.CreateOrderRequest;
import com.storeos.api.dto.AddItemRequest;
import com.storeos.api.entity.*;
import com.storeos.api.repository.*;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional (readOnly = true)
@RequiredArgsConstructor
public class OrderService {
    private final OrdersRepository ordersRepository;
    private final StoreRepository storeRepository;
    private final UsersRepository usersRepository;
    private final StoreTableRepository storeTableRepository;
    private final ProductRepository productRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final RecipeService recipeService;

    // 1. 주문 생성 (빈 주문서 만들기)
    @Transactional
    public Long createOrder(CreateOrderRequest dto) {

        Store store = storeRepository.findById(dto.getStoreId()).orElseThrow(() -> new RuntimeException("매장 없음"));
        Users users = usersRepository.findById(dto.getUserId()).orElseThrow(() -> new RuntimeException("직원 없음"));
        StoreTable storeTable = storeTableRepository.findById(dto.getTableId()).orElseThrow(() -> new RuntimeException("테이블 없음"));

        Orders orders = new Orders(store, users, storeTable);
        ordersRepository.save(orders);

        return orders.getOrderId();
    }
    // 2. 주문에 상품 담기
    @Transactional
    public void addItemToOrder(AddItemRequest dto, Long orderId){
        Orders orders = ordersRepository.findById(orderId).orElseThrow(() -> new RuntimeException("주문 없음"));
        Product product = productRepository.findById(dto.getProductId()).orElseThrow(() -> new RuntimeException("상품 없음"));

        OrderDetail orderDetail = new OrderDetail(dto.getQuantity(), orders, product);
        orderDetailRepository.save(orderDetail);

        recipeService.decreaseStockByRecipe(dto.getProductId(), dto.getQuantity());
    }
    // 3. 결제하기
    @Transactional
    public void payOrder(Long orderId, PaymentMethod paymentMethod){
        Orders orders = ordersRepository.findById(orderId).orElseThrow(() -> new RuntimeException("주문 없음"));

        orders.setPaymentMethod(paymentMethod);
        orders.setPaymentStatus(PaymentStatus.PAID);
    }

}
