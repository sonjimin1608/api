package com.storeos.api.controller;

import com.storeos.api.entity.StoreTable;
import com.storeos.api.dto.*;
import com.storeos.api.service.StoreTableService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tables")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class StoreTableController {

    private final StoreTableService storeTableService;

    // 특정 가게의 모든 테이블 조회
    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<StoreTable>> getTablesByStore(@PathVariable Long storeId) {
        List<StoreTable> tables = storeTableService.getTablesByStoreId(storeId);
        return ResponseEntity.ok(tables);
    }

    // 테이블 위치 및 크기 업데이트
    @PutMapping("/{tableId}")
    public ResponseEntity<StoreTable> updateTable(
            @PathVariable Long tableId,
            @RequestBody UpdateTablePositionRequest dto) {
        StoreTable updated = storeTableService.updateTablePosition(tableId, dto);
        return ResponseEntity.ok(updated);
    }

    // 새 테이블 생성
    @PostMapping("/store/{storeId}")
    public ResponseEntity<StoreTable> createTable(
            @PathVariable Long storeId,
            @RequestBody CreateTableRequest dto) {
        
        System.out.println("===== 테이블 생성 요청 =====");
        System.out.println("storeId: " + storeId);
        System.out.println("coordX: " + dto.getCoordX());
        System.out.println("coordY: " + dto.getCoordY());
        System.out.println("width: " + dto.getWidth());
        System.out.println("height: " + dto.getHeight());
        
        StoreTable table = storeTableService.createTable(storeId, 
                                                        dto.getCoordX(),
                                                        dto.getCoordY(),
                                                        dto.getWidth(),
                                                        dto.getHeight(),
                                                        2); // 기본으로 사람 2명
        return ResponseEntity.ok(table);
    }

    // 테이블 상세 정보 업데이트 (좌표, 크기, 인원)
    @PutMapping("/{tableId}/details")
    public ResponseEntity<StoreTable> updateTableDetails(
            @PathVariable Long tableId,
            @RequestBody UpdateTableDetailsRequest dto) {
        StoreTable updated = storeTableService.updateTableDetails(tableId, dto);
        return ResponseEntity.ok(updated);
    }

    // 테이블 삭제
    @DeleteMapping("/{tableId}")
    public ResponseEntity<Void> deleteTable(@PathVariable Long tableId) {
        storeTableService.deleteTable(tableId);
        return ResponseEntity.ok().build();
    }
}
