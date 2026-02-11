package com.storeos.api.repository;

import com.storeos.api.entity.Store;
import com.storeos.api.entity.StoreTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StoreTableRepository extends JpaRepository<StoreTable, Long> {
    List<StoreTable> findByStore(Store store);
}