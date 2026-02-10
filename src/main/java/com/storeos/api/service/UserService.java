package com.storeos.api.service;

import com.storeos.api.entity.*;
import com.storeos.api.repository.*;
import com.storeos.api.dto.CreateUserRequest;
import com.storeos.api.dto.CreateStoreRequest;
import com.storeos.api.dto.StaffSignupRequest;
import com.storeos.api.dto.LoginResponse;
import com.storeos.api.dto.LoginRequest;
import com.storeos.api.util.FileStorageUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@Transactional (readOnly = true)
@RequiredArgsConstructor
public class UserService {
    private final UsersRepository usersRepository;
    private final StoreRepository storeRepository;
    private final StoreService storeService;
    private final AdminRepository adminRepository;
    private final FileStorageUtil fileStorageUtil;
    
    // 1. 관리자 회원가입 (가게 생성 + 관리자 생성, Admin 승인 필요)
    @Transactional
    public String registerManager(CreateUserRequest userDto, CreateStoreRequest storeDto, MultipartFile verificationImage) {
        // 파일 저장
        String imageUrl = fileStorageUtil.saveFile(verificationImage);
        
        // 가게 생성
        String storeCode = storeService.registerStore(storeDto);
        
        Store store = storeRepository.findByStoreCode(storeCode)
            .orElseThrow(() -> new RuntimeException("가게 생성 실패"));
        
        // 관리자 사용자 생성 (승인 대기 상태)
        Users manager = new Users(
            userDto.getUserName(),
            userDto.getLoginId(),
            userDto.getPassword(),
            UsersRole.MANAGER,
            imageUrl,
            store
        );
        
        usersRepository.save(manager);
        
        return "관리자 가입 신청이 완료되었습니다. 관리자 승인을 기다려주세요. 가게 코드: " + storeCode;
    }
    
    // 2. 직원 회원가입 (가게 코드로 가입, MANAGER 승인 필요)
    @Transactional
    public String registerStaff(StaffSignupRequest dto) {
        Store store = storeRepository.findByStoreCode(dto.getStoreCode())
            .orElseThrow(() -> new RuntimeException("존재하지 않는 가게 코드입니다"));
        
        // 직원 사용자 생성 (승인 대기 상태)
        Users staff = new Users(
            dto.getUser().getUserName(),
            dto.getUser().getLoginId(),
            dto.getUser().getPassword(),
            UsersRole.STAFF,
            null,
            store
        );
        staff.setApprovalStatus(ApprovalStatus.PENDING);
        
        usersRepository.save(staff);
        
        return "직원 가입 신청이 완료되었습니다. 가게 관리자의 승인을 기다려주세요.";
    }
    
    // 3. 로그인 (인증)
    public LoginResponse loginUser(LoginRequest dto){
        System.out.println("🔍 로그인 시도 - ID: " + dto.getLoginId());
        
        // 먼저 Admin 테이블에서 확인
        var adminOptional = adminRepository.findByLoginId(dto.getLoginId());
        System.out.println("🔍 Admin 조회 결과: " + (adminOptional.isPresent() ? "Found" : "Not Found"));
        
        if (adminOptional.isPresent()) {
            Admin admin = adminOptional.get();
            System.out.println("🔍 Admin 비밀번호 비교 - 입력: " + dto.getPassword() + ", DB: " + admin.getPassword());
            if (!admin.getPassword().equals(dto.getPassword())) {
                throw new RuntimeException("비밀번호가 틀렸습니다.");
            }
            return new LoginResponse(
                "관리자",
                admin.getAdminId(),
                "ADMIN",
                null  // Admin은 store가 없음
            );
        }
        
        // Admin이 아니면 Users 테이블에서 확인
        System.out.println("🔍 Users 테이블에서 조회 시도");
        Users users = usersRepository.findByLoginId(dto.getLoginId())
            .orElseThrow(() -> new RuntimeException("아이디 없음"));
            
        if (!users.getPassword().equals(dto.getPassword())){
            throw new RuntimeException("비밀번호가 틀렸습니다.");
        }
        
        // 승인되지 않은 사용자는 로그인 불가
        if (users.getApprovalStatus() != ApprovalStatus.APPROVED) {
            throw new RuntimeException("승인 대기 중입니다. 관리자 승인 후 로그인해주세요.");
        }
        
        return new LoginResponse(
            users.getUserName(),
            users.getUserId(),
            users.getUsersRole().toString(),
            users.getStore().getStoreId()
        );
    }
}
