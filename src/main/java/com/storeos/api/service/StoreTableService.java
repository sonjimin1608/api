package com.storeos.api.service;

import com.storeos.api.entity.Store;
import com.storeos.api.entity.StoreTable;
import com.storeos.api.repository.StoreRepository;
import com.storeos.api.dto.UpdateTableDetailsRequest;
import com.storeos.api.dto.UpdateTablePositionRequest;
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
    public StoreTable updateDetails(Long tableId, UpdateTableDetailsRequest dto) {
        StoreTable table = storeTableRepository.findById(tableId)
                .orElseThrow(() -> new RuntimeException("테이블을 찾을 수 없습니다"));
        
        table.updateDetails(dto.getTableNumber(), dto.getCoordX(), dto.getCoordY(), dto.getHeight(), dto.getHeight(), dto.getPeople());
        
        return storeTableRepository.save(table);
    }

    // 테이블 위치 및 크기 업데이트
    @Transactional
    public StoreTable updateTablePosition(Long tableId, UpdateTablePositionRequest dto) {
        StoreTable table = storeTableRepository.findById(tableId)
                .orElseThrow(() -> new RuntimeException("테이블을 찾을 수 없습니다"));
        
        table.updatePosition(dto.getCoordX(), dto.getCoordY(), dto.getWidth(), dto.getHeight());
        
        return storeTableRepository.save(table);
    }

    // 새 테이블 생성
    @Transactional
    public StoreTable createTable(Long storeId, Integer coordX, Integer coordY, Integer width, Integer height, Integer people) {
        System.out.println("===== StoreTableService.createTable 시작 =====");
        System.out.println("storeId: " + storeId);
        System.out.println("coordX: " + coordX + ", coordY: " + coordY);
        System.out.println("width: " + width + ", height: " + height);
        System.out.println("people: " + people);
        
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> {
                    System.err.println("❌ 가게를 찾을 수 없습니다. storeId: " + storeId);
                    return new RuntimeException("가게를 찾을 수 없습니다. storeId: " + storeId);
                });
        
        System.out.println("✅ Store 찾기 성공: " + store.getStoreName());
        
        // 해당 가게의 테이블 중 가장 큰 번호 찾기
        List<StoreTable> existingTables = storeTableRepository.findByStore(store);
        Integer nextTableNumber = existingTables.stream()
                .map(StoreTable::getTableNumber)
                .max(Integer::compareTo)
                .orElse(0) + 1;
        
        System.out.println("다음 테이블 번호: " + nextTableNumber);
        
        StoreTable table = new StoreTable(nextTableNumber, coordX, coordY, width, height, people, store);
        System.out.println("✅ StoreTable 객체 생성 완료");
        
        StoreTable saved = storeTableRepository.save(table);
        System.out.println("✅ StoreTable 저장 완료. tableId: " + saved.getTableId());
        
        return saved;
    }

    // 테이블 상세 정보 업데이트
    @Transactional
    public StoreTable updateTableDetails(Long tableId, UpdateTableDetailsRequest dto) {
        StoreTable table = storeTableRepository.findById(tableId)
                .orElseThrow(() -> new RuntimeException("테이블을 찾을 수 없습니다"));
        
        table.updateDetails(dto.getTableNumber(),
                            dto.getCoordX(),
                            dto.getCoordY(),
                            dto.getWidth(),
                            dto.getHeight(),
                            dto.getPeople());
        
        return storeTableRepository.save(table);
    }

    // 테이블 삭제
    @Transactional
    public void deleteTable(Long tableId) {
        StoreTable table = storeTableRepository.findById(tableId)
                .orElseThrow(() -> new RuntimeException("테이블을 찾을 수 없습니다"));
        storeTableRepository.delete(table);
    }
}
