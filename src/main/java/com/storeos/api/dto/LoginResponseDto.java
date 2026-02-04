package com.storeos.api.dto; // dto 패키지 하나 만들면 좋아

import lombok.AllArgsConstructor;
import lombok.Data;
import com.storeos.api.entity.UsersRole;

@Data
@AllArgsConstructor
public class LoginResponseDto {
    private String userName;
    private Long userId;
    private UsersRole role;
    // 나중엔 여기에 "토큰(Token)"이 들어감
}