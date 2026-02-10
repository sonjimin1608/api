package com.storeos.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.storeos.api.entity.ApprovalStatus;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PendingUserResponse {
    private Long userId;
    private String userName;
    private String loginId;
    private String role; // MANAGER or STAFF
    private ApprovalStatus approvalStatus;
    private String verificationImageUrl;
    
    // 가게 정보 (Manager인 경우)
    private String storeName;
    private String businessNumber;
    private String managerName;
    
    // 가게 정보 (Staff인 경우)
    private String storeCode;
    private String existingStoreName;
}
