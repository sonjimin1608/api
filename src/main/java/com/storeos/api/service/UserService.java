package com.storeos.api.service;

import com.storeos.api.entity.*;
import com.storeos.api.repository.*;
import com.storeos.api.dto.CreateUserRequest;
import com.storeos.api.dto.LoginResponse;
import com.storeos.api.dto.LoginRequest;
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
    public String registerUser(CreateUserRequest dto, Long storeId){
        Store store = storeRepository.findById(storeId).orElseThrow(() -> new RuntimeException("가게 없음"));
        Users users = new Users(dto.getUserName(), dto.getLoginId(), dto.getPassword(), dto.getUsersRole(), store);

        usersRepository.save(users);
        return users.getLoginId();
    }  
    // 2. 로그인 (인증)
    public LoginResponse loginUser(LoginRequest dto){
        Users users = usersRepository.findByLoginId(dto.getLoginId()).orElseThrow(() -> new RuntimeException("아이디 없음"));
        if (!users.getPassword().equals(dto.getPassword())){
            throw new RuntimeException("비밀번호가 틀렸습니다.");
        }
        return new LoginResponse(
            users.getUserName(),
            users.getUserId(),
            users.getUsersRole(),
            users.getStore().getStoreId()
        );
    }
}
