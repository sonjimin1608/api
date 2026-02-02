package com.storeos.api.repository;

import com.storeos.api.entity.StoreTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StoreTableRepository extends JpaRepository<StoreTable, Long> {
    
}