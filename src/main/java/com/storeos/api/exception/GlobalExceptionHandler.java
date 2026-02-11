package com.storeos.api.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice // "모든 컨트롤러에서 발생하는 사고는 내가 처리한다!"
public class GlobalExceptionHandler {

    // 1. 우리가 의도적으로 발생시킨 에러 (throw new RuntimeException("..."))
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException e) {
        System.err.println("❌ RuntimeException 발생: " + e.getMessage());
        e.printStackTrace();
        
        Map<String, String> response = new HashMap<>();
        response.put("error_type", "비즈니스 로직 에러");
        response.put("message", e.getMessage()); // "가게 없음", "재고 부족" 등 우리가 적은 메시지

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    // 2. 알 수 없는 시스템 에러 (NullPointerException 등)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleException(Exception e) {
        System.err.println("❌❌❌ Exception 발생: " + e.getClass().getName() + " - " + e.getMessage());
        e.printStackTrace();
        
        Map<String, String> response = new HashMap<>();
        response.put("error_type", "시스템 에러");
        response.put("message", "서버 에러: " + e.getMessage()); // 개발 중이므로 실제 메시지 보여주기
        response.put("exception", e.getClass().getSimpleName());

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}