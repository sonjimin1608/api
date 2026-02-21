package com.storeos.api.repository;

import com.storeos.api.entity.Ingredient;
import com.storeos.api.entity.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface IngredientRepository extends JpaRepository<Ingredient, Long> {
    List<Ingredient> findByStore(Store store);
}