package com.storeos.api.controller;

import org.springframework.web.bind.annotation.RestController;

import com.storeos.api.dto.CreateStoreRequest;
import com.storeos.api.dto.UpdateStoreRequest;
import com.storeos.api.service.StoreService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor

public class StoreController {

    private final StoreService storeService;

    // 1. 가게 생성
    @PostMapping("/stores")
    public ResponseEntity<Long> registerStore(@RequestBody CreateStoreRequest dto) {
        
        Long storeId = storeService.registerStore(dto);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(storeId);
    }
    
    // 2. 테이블 생성
    @PostMapping("/stores/{storeId}/tables")
    public ResponseEntity<Long> createTable(@PathVariable Long storeId) {
        
        Long tableId = storeService.createTable(storeId);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(tableId);
    }

    // 3. 가게 정보 수정
    @PutMapping("/stores/{storeId}/update")
    public ResponseEntity<Void> updateStoreInfo(@PathVariable Long storeId,        
                                                @RequestBody UpdateStoreRequest dto) {
        storeService.updateStoreInfo(dto, storeId);
        return ResponseEntity.ok().build();
    }
    
    
}
