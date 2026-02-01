package com.storeos.api.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity                        // "이건 DB 테이블이야!"
@Getter                        // "데이터 조회 기능 자동 생성"
@Table(name = "store")         // "DB에는 'store'라는 이름으로 만들어줘"
@NoArgsConstructor             // "기본 생성자 필수"
public class Store {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "store_id")
    private Long storeId;      // PK

    @Column(name = "store_name", nullable = false)
    private String storeName;

    @Column(name = "business_number", length = 20, nullable = false)
    private String businessNumber; // 사업자 번호 (문자열)

    @Column(name = "owner_name", nullable = false)
    private String ownerName;

    @Column(name = "status", nullable = false)
    private String status;     // OPEN / CLOSE

    @Column(name = "congestion_level")
    private Integer congestionLevel; // 0 ~ 100

    // 생성자
    public Store(String storeName, String businessNumber, String ownerName) {
        this.storeName = storeName;
        this.businessNumber = businessNumber;
        this.ownerName = ownerName;
        this.status = "OPEN";
        this.congestionLevel = 0;
    }
}