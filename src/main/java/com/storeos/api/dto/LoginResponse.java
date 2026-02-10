package com.storeos.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private String userName;
    private Long userId;
    private String role; // "ADMIN", "MANAGER", "STAFF"
    private Long storeId;
    // 나중엔 여기에 "토큰(Token)"이 들어감
}