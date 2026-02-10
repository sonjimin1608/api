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
import com.storeos.api.service.AdminService;

import lombok.RequiredArgsConstructor;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class AdminController {
    
    private final AdminService adminService;
    
    // 1. 대기 중인 모든 관리자 가입 요청 조회
    @GetMapping("/pending/managers")
    public ResponseEntity<List<PendingUserResponse>> getPendingManagers() {
        List<PendingUserResponse> pendingManagers = adminService.getPendingManagers();
        return ResponseEntity.ok(pendingManagers);
    }
    
    // 2. 관리자 가입 승인/거절
    @PutMapping("/approve/manager/{userId}")
    public ResponseEntity<String> approveManager(
            @PathVariable Long userId,
            @RequestParam boolean approved) {
        String message = adminService.approveManager(userId, approved);
        return ResponseEntity.ok(message);
    }
}
