package com.storeos.api.service;

import com.storeos.api.entity.*;
import com.storeos.api.repository.*;
import com.storeos.api.dto.PendingUserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class AdminService {
    
    private final UsersRepository usersRepository;
    
    // 1. 승인 대기 중인 관리자 목록 조회
    public List<PendingUserResponse> getPendingManagers() {
        List<Users> pendingManagers = usersRepository
            .findByUsersRoleAndApprovalStatus(UsersRole.MANAGER, ApprovalStatus.PENDING);
        
        return pendingManagers.stream()
            .map(user -> {
                PendingUserResponse response = new PendingUserResponse();
                response.setUserId(user.getUserId());
                response.setUserName(user.getUserName());
                response.setLoginId(user.getLoginId());
                response.setRole("MANAGER");
                response.setApprovalStatus(user.getApprovalStatus());
                response.setVerificationImageUrl(user.getVerificationImageUrl());
                
                // 가게 정보
                if (user.getStore() != null) {
                    response.setStoreName(user.getStore().getStoreName());
                    response.setBusinessNumber(user.getStore().getBusinessNumber());
                    response.setManagerName(user.getStore().getManagerName());
                    response.setStoreCode(user.getStore().getStoreCode());
                }
                
                return response;
            })
            .collect(Collectors.toList());
    }
    
    // 2. 관리자 승인/거절
    @Transactional
    public String approveManager(Long userId, boolean approved) {
        Users user = usersRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));
        
        if (user.getUsersRole() != UsersRole.MANAGER) {
            throw new RuntimeException("관리자만 승인할 수 있습니다");
        }
        
        if (approved) {
            user.setApprovalStatus(ApprovalStatus.APPROVED);
            return "관리자 가입이 승인되었습니다";
        } else {
            user.setApprovalStatus(ApprovalStatus.REJECTED);
            return "관리자 가입이 거절되었습니다";
        }
    }
}
