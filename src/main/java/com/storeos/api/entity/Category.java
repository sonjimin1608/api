package com.storeos.api.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity                        // "이건 DB 테이블이야!"
@Getter                        // "데이터 조회 기능 자동 생성"
@Table(name = "category")         // "DB에는 'category'라는 이름으로 만들어줘"
@NoArgsConstructor

public class Category {
    @Id //무조건 PK가 됨.
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 너가 직접 순차적으로 번호 붙여줘. 
    @Column(name = "category_id")
    private Long categoryId;

    @Column(name = "category_name", nullable = false)
    private String categoryName;

    @ManyToOne(fetch = FetchType.LAZY) // 미리 Store entity를 가져오는게 아니라, 실제로 참고하는 명령이 떨어졌을 때! 찾음. 그래서 Lazy.
    @JoinColumn(name = "store_id")
    private Store store;

    // 생성자
    public Category(String categoryName, Store store) {
        this.categoryName = categoryName;
        this.store = store;
    }

    // 카테고리 이름 업데이트
    public void updateCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }
}
