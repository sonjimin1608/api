package com.storeos.api.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.storeos.api.dto.CreateUserRequest;
import com.storeos.api.dto.CreateStoreRequest;
import com.storeos.api.dto.StaffSignupRequest;
import com.storeos.api.dto.LoginResponse;
import com.storeos.api.dto.LoginRequest;
import com.storeos.api.service.UserService;

import lombok.RequiredArgsConstructor;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.CrossOrigin;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestPart;



@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor

public class UserController {

    private final UserService userService;
    
    // 1. 관리자 회원가입 (가게 정보 포함 + 파일 업로드)
    @PostMapping("/signup/manager")
    public ResponseEntity<String> registerManager(
            @RequestPart("user") CreateUserRequest user,
            @RequestPart("store") CreateStoreRequest store,
            @RequestPart("verificationImage") MultipartFile verificationImage) {
        String message = userService.registerManager(user, store, verificationImage);
        return ResponseEntity.status(HttpStatus.CREATED).body(message);
    }

    // 2. 직원 회원가입 (가게 코드로 가입)
    @PostMapping("/signup/staff")
    public ResponseEntity<String> registerStaff(@RequestBody StaffSignupRequest dto) {
        String message = userService.registerStaff(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(message);
    }

    // 3. 로그인 (인증)
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> loginUser(@RequestBody LoginRequest dto) {
        LoginResponse loginResponse = userService.loginUser(dto);
        return ResponseEntity.ok(loginResponse);
    }
    

}
