package com.storeos.api.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.storeos.api.dto.CreateUserRequest;
import com.storeos.api.dto.LoginResponse;
import com.storeos.api.dto.LoginRequest;
import com.storeos.api.service.UserService;

import lombok.RequiredArgsConstructor;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.RequestBody;



@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor

public class UserController {

    private final UserService userService;
    
    // 1. 유저 생성
    @PostMapping("/storeos/{storeId}/users")
    public ResponseEntity<String> registerUser(@RequestBody CreateUserRequest dto,
                                             @PathVariable Long storeId) {
        
        String loginId = userService.registerUser(dto, storeId);
        return ResponseEntity.status(HttpStatus.CREATED).body(loginId);
    }

    // 2. 로그인 (인증)
    @GetMapping("/login")
    public ResponseEntity<LoginResponse> loginUser(@PathVariable Long storeId,
                                                   @RequestBody LoginRequest dto) {
        LoginResponse loginResponse = userService.loginUser(dto);
        return ResponseEntity.ok(loginResponse);
    }
    
    

}
