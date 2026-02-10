package com.storeos.api.service;

import com.storeos.api.entity.Store;
import com.storeos.api.entity.StoreTable;
import com.storeos.api.repository.StoreRepository;
import com.storeos.api.repository.StoreTableRepository;
import com.storeos.api.dto.CreateStoreRequest;
import com.storeos.api.dto.UpdateStoreRequest;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Random;

@Service
@Transactional (readOnly = true)
@RequiredArgsConstructor
public class StoreService {
    private final StoreRepository storeRepository;
    private final StoreTableRepository storeTableRepository;
    
    // 가게 코드 생성 메서드 (ST + 랜덤 5자리 숫자)
    private String generateStoreCode() {
        Random random = new Random();
        String code;
        do {
            int randomNumber = 10000 + random.nextInt(90000); // 10000~99999
            code = "ST" + randomNumber;
        } while (storeRepository.findByStoreCode(code).isPresent()); // 중복 체크
        return code;
    }
    
    // 1. 가게 생성
    @Transactional
    public String registerStore(CreateStoreRequest dto){
        String storeCode = generateStoreCode();
        Store store = new Store(
            storeCode,
            dto.getStoreName(),
            dto.getBusinessNumber(),
            dto.getManagerName()
        );

        storeRepository.save(store);

        return storeCode; // ID 대신 코드 반환
    }

    // 2. 테이블 생성
    @Transactional
    public Long createTable(Long storeId){
        Store store = storeRepository.findById(storeId).orElseThrow(() -> new RuntimeException("가게 없음"));
        StoreTable storeTable = new StoreTable(0, 0, 100, 100, 2, store);
        storeTableRepository.save(storeTable);

        return storeTable.getTableId();
    }

    // 3. 가게 정보 수정
    @Transactional
    public void updateStoreInfo(UpdateStoreRequest dto, Long storeId){
        Store store = storeRepository.findById(storeId).orElseThrow(() -> new RuntimeException("가게 없음"));
        
        store.updateInfo(dto.getStoreName(), dto.getBusinessNumber(), dto.getManagerName());

    }
}
