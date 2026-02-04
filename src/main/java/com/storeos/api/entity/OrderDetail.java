package com.storeos.api.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity                        // "이건 DB 테이블이야!"
@Getter                        // "데이터 조회 기능 자동 생성"
@Table(name = "order_detail")
@NoArgsConstructor   

public class OrderDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "detail_id")
    private Long detailId;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "unit_price")
    private Integer unitPrice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Orders orders;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    public OrderDetail(Integer quantity, Orders orders, Product product){
        this.quantity = quantity;
        this.unitPrice = product.getProductPrice();
        this.orders = orders;
        this.product = product;
    }
}
