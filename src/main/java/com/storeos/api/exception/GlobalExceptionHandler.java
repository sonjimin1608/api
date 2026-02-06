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
        Map<String, String> response = new HashMap<>();
        response.put("error_type", "비즈니스 로직 에러");
        response.put("message", e.getMessage()); // "가게 없음", "재고 부족" 등 우리가 적은 메시지

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    // 2. 알 수 없는 시스템 에러 (NullPointerException 등)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleException(Exception e) {
        Map<String, String> response = new HashMap<>();
        response.put("error_type", "시스템 에러");
        response.put("message", "서버 관리자에게 문의하세요."); // 사용자를 안심시키는 메시지

        // 서버 로그에는 진짜 에러를 남겨둠 (개발자가 봐야 하니까)
        e.printStackTrace(); 

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}