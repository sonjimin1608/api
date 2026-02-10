package com.storeos.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor // 기본 생성자 (나중에 JSON 변환할 때 필수)
public class UpdateStoreRequest {
    private String storeName;
    private String businessNumber;
    private String managerName;
    // 나중에 주소, 전화번호 등 추가될 때 여기만 늘리면 됨
}