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
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "http://localhost:5173") // 👈 이거 추가! (프론트 주소 허용)
@RequiredArgsConstructor

public class StoreController {

    private final StoreService storeService;

    // 1. 가게 생성
    @PostMapping("/stores")
    public ResponseEntity<String> registerStore(@RequestBody CreateStoreRequest dto) {
        
        String storeCode = storeService.registerStore(dto);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(storeCode);
    }

    // 2. 가게 정보 수정
    @PutMapping("/stores/{storeId}/update")
    public ResponseEntity<Void> updateStoreInfo(@PathVariable Long storeId,        
                                                @RequestBody UpdateStoreRequest dto) {
        storeService.updateStoreInfo(dto, storeId);
        return ResponseEntity.ok().build();
    }
    
    
}
