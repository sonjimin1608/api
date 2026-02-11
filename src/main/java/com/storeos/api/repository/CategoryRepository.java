package com.storeos.api.repository;

import com.storeos.api.entity.Category;
import com.storeos.api.entity.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByStore(Store store);
}