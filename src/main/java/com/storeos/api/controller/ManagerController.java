package com.storeos.api.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.http.ResponseEntity;

import com.storeos.api.dto.PendingUserResponse;
import com.storeos.api.service.ManagerService;

import lombok.RequiredArgsConstructor;

import java.util.List;

@RestController
@RequestMapping("/api/v1/manager")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class ManagerController {
    
    private final ManagerService managerService;
    
    // 1. 내 가게에 가입 신청한 대기 중인 직원 조회
    @GetMapping("/pending/staff/{storeCode}")
    public ResponseEntity<List<PendingUserResponse>> getPendingStaff(@PathVariable String storeCode) {
        List<PendingUserResponse> pendingStaff = managerService.getPendingStaff(storeCode);
        return ResponseEntity.ok(pendingStaff);
    }
    
    // 2. 직원 가입 승인/거절
    @PutMapping("/approve/staff/{userId}")
    public ResponseEntity<String> approveStaff(
            @PathVariable Long userId,
            @RequestParam boolean approved) {
        String message = managerService.approveStaff(userId, approved);
        return ResponseEntity.ok(message);
    }
}
