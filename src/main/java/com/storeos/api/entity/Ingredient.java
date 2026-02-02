package com.storeos.api.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity                        // "이건 DB 테이블이야!"
@Getter                        // "데이터 조회 기능 자동 생성"
@Table(name = "ingredient")
@NoArgsConstructor   

public class Ingredient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ingredient_id")
    private Long ingredientId;

    @Column(name = "ingredient_name", nullable = false)
    private String ingredientName;

    @Column(name = "current_stock", nullable = false)
    private Integer currentStock;

    @Column(name = "unit", nullable = false)
    private String unit;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id")
    private Store store;

    public Ingredient(String ingredientName, Integer currentStock, String unit, Store store){
        this.ingredientName = ingredientName;
        this.currentStock = 0;
        this.unit = unit;
        this.store = store;
    }
}
