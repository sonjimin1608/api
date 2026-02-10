package com.storeos.api.config;

import com.storeos.api.entity.Admin;
import com.storeos.api.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * 서버 시작 시 초기 데이터를 생성하는 클래스
 */
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final AdminRepository adminRepository;

    @Override
    public void run(String... args) throws Exception {
        // admin 계정이 이미 존재하는지 확인
        if (adminRepository.findByLoginId("admin").isEmpty()) {
            // admin 계정 생성
            Admin admin = new Admin(
                "admin",           // loginId
                "1234"             // password (실제 환경에서는 암호화 필요)
            );
            
            adminRepository.save(admin);
            System.out.println("✅ 기본 admin 계정이 생성되었습니다. (로그인ID: admin, 비밀번호: 1234)");
        } else {
            System.out.println("ℹ️ admin 계정이 이미 존재합니다.");
        }
    }
}
