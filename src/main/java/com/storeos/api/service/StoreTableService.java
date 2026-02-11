package com.storeos.api.service;

import com.storeos.api.entity.Store;
import com.storeos.api.entity.StoreTable;
import com.storeos.api.repository.StoreRepository;
import com.storeos.api.repository.StoreTableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class StoreTableService {
    
    private final StoreTableRepository storeTableRepository;
    private final StoreRepository storeRepository;

    // 가게의 모든 테이블 조회
    public List<StoreTable> getTablesByStoreId(Long storeId) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new RuntimeException("가게를 찾을 수 없습니다"));
        return storeTableRepository.findByStore(store);
    }

    // 테이블 위치 및 크기 업데이트
    @Transactional
    public StoreTable updateTablePosition(Long tableId, Integer coordX, Integer coordY, Integer width, Integer height) {
        StoreTable table = storeTableRepository.findById(tableId)
                .orElseThrow(() -> new RuntimeException("테이블을 찾을 수 없습니다"));
        
        table.updatePosition(coordX, coordY, width, height);
        
        return storeTableRepository.save(table);
    }

    // 새 테이블 생성
    @Transactional
    public StoreTable createTable(Long storeId, Integer coordX, Integer coordY, Integer width, Integer height, Integer people) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new RuntimeException("가게를 찾을 수 없습니다"));
        
        StoreTable table = new StoreTable(coordX, coordY, width, height, people, store);
        return storeTableRepository.save(table);
    }
}
