package com.storeos.api.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity                        // "이건 DB 테이블이야!"
@Getter                        // "데이터 조회 기능 자동 생성"
@Table(name = "store_table")
@NoArgsConstructor    

public class StoreTable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "table_id")
    private Long tableId;

    @Column(name = "coord_X")
    private Integer coordX;

    @Column(name = "coord_Y")
    private Integer coordY;

    @Column(name = "table_width")
    private Integer tableWidth;

    @Column(name = "table_height")
    private Integer tableHeight;

    @Column(name = "table_people")
    private Integer tablePeople;

    @Enumerated(EnumType.STRING)
    @Column(name = "table_status")
    private TableStatus tableStatus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id")
    private Store store;

    public StoreTable(Integer coordX, Integer coordY, Integer tableWidth, Integer tableHeight, Integer tablePeople, TableStatus tableStatus, Store store){
        this.coordX = coordX;
        this.coordY = coordY;
        this.tableWidth = tableWidth;
        this.tableHeight = tableHeight;
        this.tablePeople = tablePeople;
        this.tableStatus = TableStatus.EMPTY;
        this.store = store;
    }
    // 상태 변경 메서드 (손님 오면 호출)
    public void sitDown() {
        this.tableStatus = TableStatus.SEATED;
    }

    public void clearTable() {
        this.tableStatus = TableStatus.EMPTY;
    }
}
