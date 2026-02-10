package com.storeos.api.repository;

import com.storeos.api.entity.Users;
import com.storeos.api.entity.UsersRole;
import com.storeos.api.entity.ApprovalStatus;
import com.storeos.api.entity.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface UsersRepository extends JpaRepository<Users, Long> {

    // 🌟 마법의 한 줄: 로그인 아이디로 유저 찾기
    // SQL: SELECT * FROM users WHERE login_id = ?
    Optional<Users> findByLoginId(String loginId);
    
    // 역할과 승인 상태로 사용자 목록 찾기
    List<Users> findByUsersRoleAndApprovalStatus(UsersRole usersRole, ApprovalStatus approvalStatus);
    
    // 가게와 승인 상태로 사용자 목록 찾기 (관리자가 자기 가게 직원 조회용)
    List<Users> findByStoreAndApprovalStatus(Store store, ApprovalStatus approvalStatus);
}