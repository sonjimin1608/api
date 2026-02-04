package com.storeos.api.service;

import com.storeos.api.entity.Store;
import com.storeos.api.entity.StoreTable;
import com.storeos.api.repository.StoreRepository;
import com.storeos.api.repository.StoreTableRepository;
import com.storeos.api.dto.StoreInfoDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional (readOnly = true)
@RequiredArgsConstructor
public class StoreService {
    private final StoreRepository storeRepository;
    private final StoreTableRepository storeTableRepository;

    @Transactional
    public Long registerStore(StoreInfoDto dto){
        Store store = new Store(
            dto.getStoreName(),
            dto.getBusinessNum(),
            dto.getOwnerName()
        );

        storeRepository.save(store);

        return store.getStoreId();
    }

    @Transactional
    public Long createTable(Long storeId){
        Store store = storeRepository.findById(storeId).orElseThrow(() -> new RuntimeException("가게 없음"));
        StoreTable storeTable = new StoreTable(0, 0, 100, 100, 2, store);
        storeTableRepository.save(storeTable);

        return storeTable.getTableId();
    }

    @Transactional
    public void updateStoreInfo(StoreInfoDto dto, Long storeId){
        Store store = storeRepository.findById(storeId).orElseThrow(() -> new RuntimeException("가게 없음"));
        
        store.updateInfo(dto.getStoreName(), dto.getBusinessNum(), dto.getOwnerName());

    }
}
