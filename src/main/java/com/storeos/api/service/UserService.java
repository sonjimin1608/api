package com.storeos.api.service;

import com.storeos.api.entity.*;
import com.storeos.api.repository.*;
import com.storeos.api.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional (readOnly = true)
@RequiredArgsConstructor
public class UserService {
    private final UsersRepository usersRepository;
    private final StoreRepository storeRepository;
    // 1. 직원 채용 (회원가입)
    @Transactional
    public String registerUser(String userName, String loginId, String password, UsersRole usersRole, Long storeId){
        Store store = storeRepository.findById(storeId).orElseThrow(() -> new RuntimeException("가게 없음"));
        Users users = new Users(userName, loginId, password, usersRole, store);

        usersRepository.save(users);
        return loginId;
    }  
    // 2. 로그인 (인증)
    public LoginResponseDto loginUser(String loginId, String password, Long storeId){
        Users users = usersRepository.findByLoginId(loginId).orElseThrow(() -> new RuntimeException("아이디 없음"));
        if (!users.getPassword().equals(password)){
            throw new RuntimeException("비밀번호가 틀렸습니다.");
        }
        return new LoginResponseDto(
            users.getUserName(),
            users.getUserId(),
            users.getUsersRole()
        );
    }
}
