package com.storeos.api.controller;

import com.storeos.api.entity.StoreTable;
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
            @RequestParam Integer coordX,
            @RequestParam Integer coordY,
            @RequestParam Integer width,
            @RequestParam Integer height) {
        StoreTable updated = storeTableService.updateTablePosition(tableId, coordX, coordY, width, height);
        return ResponseEntity.ok(updated);
    }

    // 새 테이블 생성
    @PostMapping("/store/{storeId}")
    public ResponseEntity<StoreTable> createTable(
            @PathVariable Long storeId,
            @RequestParam Integer coordX,
            @RequestParam Integer coordY,
            @RequestParam Integer width,
            @RequestParam Integer height,
            @RequestParam Integer people) {
        StoreTable table = storeTableService.createTable(storeId, coordX, coordY, width, height, people);
        return ResponseEntity.ok(table);
    }
}
