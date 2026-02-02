package com.storeos.api.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity                        // "이건 DB 테이블이야!"
@Getter                        // "데이터 조회 기능 자동 생성"
@Table(name = "product")         // "DB에는 'product'라는 이름으로 만들어줘"
@NoArgsConstructor    
public class Product {

    @Id //무조건 PK가 됨.
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 너가 직접 랜덤하게 번호 붙여줘. 
    @Column(name = "product_id")
    private Long productId;      // PK

    @Column(name = "product_name", nullable = false)
    private String productName;   // 상품명

    @Column(name = "product_price", nullable = false)
    private Integer productPrice;  // 상품 가격

    @Enumerated(EnumType.STRING)
    @Column(name = "product_status", nullable = false)
    private ProductStatus productStatus;      // Sale or Sold out

    // Foreign key 넣는 방법
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;      // category이라는 객체 생성. 그리고 그 객체 자체를 하나의 데이터로 갖고 있는 것. FK

    // 생성자
    public Product(String productName, Integer productPrice, ProductStatus productStatus, Category category) {
        this.productName = productName;
        this.productPrice = productPrice;
        this.productStatus = productStatus;
        this.category = category;
    }
}