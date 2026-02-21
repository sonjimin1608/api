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
    private Double currentStock;

    @Column(name = "unit", nullable = false)
    private String unit;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id")
    private Store store;

    public Ingredient(String ingredientName, Double currentStock, String unit, Store store){
        this.ingredientName = ingredientName;
        this.currentStock = currentStock;
        this.unit = unit;
        this.store = store;
    }

    public void addStock(Double amount){
        this.currentStock += amount;
    }

    public void removeStock(Double amount){
        Double restStock = this.currentStock - amount;
        if(restStock < 0){
            throw new RuntimeException("재료 부족 (현재: " + this.currentStock + ", 필요: " + amount + ")");
        }
        this.currentStock = restStock;
    }

    // 재료 정보 업데이트
    public void updateIngredient(String ingredientName, Double currentStock, String unit) {
        this.ingredientName = ingredientName;
        this.currentStock = currentStock;
        this.unit = unit;
    }
    
}
