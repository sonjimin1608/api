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
public class ManagerService {
    
    private final UsersRepository usersRepository;
    private final StoreRepository storeRepository;
    
    // 1. 내 가게에 승인 대기 중인 직원 목록 조회
    public List<PendingUserResponse> getPendingStaff(String storeCode) {
        Store store = storeRepository.findByStoreCode(storeCode)
            .orElseThrow(() -> new RuntimeException("가게를 찾을 수 없습니다"));
        
        List<Users> pendingStaff = usersRepository
            .findByStoreAndApprovalStatus(store, ApprovalStatus.PENDING);
        
        return pendingStaff.stream()
            .filter(user -> user.getUsersRole() == UsersRole.STAFF)
            .map(user -> {
                PendingUserResponse response = new PendingUserResponse();
                response.setUserId(user.getUserId());
                response.setUserName(user.getUserName());
                response.setLoginId(user.getLoginId());
                response.setRole("STAFF");
                response.setApprovalStatus(user.getApprovalStatus());
                response.setStoreCode(storeCode);
                response.setExistingStoreName(store.getStoreName());
                
                return response;
            })
            .collect(Collectors.toList());
    }
    
    // 2. 직원 승인/거절
    @Transactional
    public String approveStaff(Long userId, boolean approved) {
        Users user = usersRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));
        
        if (user.getUsersRole() != UsersRole.STAFF) {
            throw new RuntimeException("직원만 승인할 수 있습니다");
        }
        
        if (approved) {
            user.setApprovalStatus(ApprovalStatus.APPROVED);
            return "직원 가입이 승인되었습니다";
        } else {
            user.setApprovalStatus(ApprovalStatus.REJECTED);
            return "직원 가입이 거절되었습니다";
        }
    }
}
