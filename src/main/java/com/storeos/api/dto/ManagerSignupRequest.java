package com.storeos.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ManagerSignupRequest {
    private CreateUserRequest user;
    private CreateStoreRequest store;
    private String verificationImageUrl;
}
