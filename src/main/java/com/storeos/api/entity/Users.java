package com.storeos.api.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity                        // "이건 DB 테이블이야!"
@Getter                        // "데이터 조회 기능 자동 생성"
@Table(name = "users")         // "DB에는 'users'라는 이름으로 만들어줘"
@NoArgsConstructor    
public class Users {

    @Id //무조건 PK가 됨.
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 너가 직접 랜덤하게 번호 붙여줘. 
    @Column(name = "user_id")
    private Long userId;      // PK

    @Column(name = "login_id", nullable = false, unique = true)
    private String loginId;   // 개인 아이디

    @Column(name = "password",nullable = false)
    private String password;  // 비밀번호

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private UsersRole usersRole;      // Manager or Staff

    // Foreign key 넣는 방법
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id")
    private Store store;      // store이라는 객체 생성. 그리고 그 객체 자체를 하나의 데이터로 갖고 있는 것. FK

    // 생성자
    public Users(String loginId, String password, UsersRole usersRole, Store store) {
        this.loginId = loginId;
        this.password = password;
        this.usersRole = usersRole;
        this.store = store;
    }
}