package com.storeos.api.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity                        // "이건 DB 테이블이야!"
@Getter    
@Setter                    // "데이터 조회 기능 자동 생성"
@Table(name = "orders")
@NoArgsConstructor    

public class Orders{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Long orderId;

    @Column(name = "order_time", nullable = false)
    private LocalDateTime orderTime;

    @Column(name = "total_amount", nullable = false)
    private Long totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method")
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status")
    private PaymentStatus paymentStatus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id")
    private Store store;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private Users users;
    
    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name = "table_id")
    private StoreTable storeTable;

    // 생성자 아직 store_table 안 만듬 수정 필요
    public Orders(Store store, Users users, StoreTable storeTable){
        this.orderTime = LocalDateTime.now();
        this.totalAmount = 0L;
        this.paymentMethod = null;
        this.paymentStatus = PaymentStatus.PENDING;
        this.store = store;
        this.users = users;
        this.storeTable = storeTable;
    }
}
