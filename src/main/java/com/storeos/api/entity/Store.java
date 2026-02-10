package com.storeos.api.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity                        // "이건 DB 테이블이야!"
@Getter                        // "데이터 조회 기능 자동 생성"
@Setter
@Table(name = "store")         // "DB에는 'store'라는 이름으로 만들어줘"
@NoArgsConstructor             // "기본 생성자 필수"
public class Store {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "store_id")
    private Long storeId;      // PK

    @Column(name = "store_code", unique = true, nullable = false, length = 10)
    private String storeCode; // 가게 고유 코드 (예: ST12345)

    @Column(name = "store_name", nullable = false)
    private String storeName;

    @Column(name = "business_number", length = 20, nullable = false)
    private String businessNumber; // 사업자 번호 (문자열)

    @Column(name = "manager_name", nullable = false)
    private String managerName;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private StoreStatus storeStatus;     // OPEN / CLOSE

    @Column(name = "congestion_level", nullable = false)
    private Integer congestionLevel; // 0 ~ 100

    // 생성자
    public Store(String storeCode, String storeName, String businessNumber, String managerName) {
        this.storeCode = storeCode;
        this.storeName = storeName;
        this.businessNumber = businessNumber;
        this.managerName = managerName;
        this.storeStatus = StoreStatus.OPEN;
        this.congestionLevel = 0;
    }

    public void updateInfo(String storeName, String businessNumber, String managerName){
        this.storeName = storeName;
        this.businessNumber = businessNumber;
        this.managerName = managerName;
    }
}