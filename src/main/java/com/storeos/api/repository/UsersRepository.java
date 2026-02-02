package com.storeos.api.repository;

import com.storeos.api.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UsersRepository extends JpaRepository<Users, Long> {

    // 🌟 마법의 한 줄: 로그인 아이디로 유저 찾기
    // SQL: SELECT * FROM users WHERE login_id = ?
    Optional<Users> findByLoginId(String loginId);
}