package com.storeos.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.storeos.api.entity.UsersRole;

@Data
@AllArgsConstructor
@NoArgsConstructor // 기본 생성자 (나중에 JSON 변환할 때 필수)
public class CreateUserRequest {
    private String userName; 
    private String loginId; 
    private String password; 
    private UsersRole usersRole;
}
