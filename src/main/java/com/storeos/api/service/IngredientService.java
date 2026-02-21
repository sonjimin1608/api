package com.storeos.api.service;

import com.storeos.api.entity.*;
import com.storeos.api.repository.*;
import com.storeos.api.dto.CreateIngredientRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class IngredientService {
    private final IngredientRepository ingredientRepository;
    private final StoreRepository storeRepository;

    // 재료 등록
    @Transactional
    public Long registerIngredient(CreateIngredientRequest dto, Long storeId) {
        System.out.println("=== 재료 등록 - 받은 currentStock: " + dto.getCurrentStock() + " (타입: " + dto.getCurrentStock().getClass().getName() + ")");
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new RuntimeException("가게 없음"));
        Ingredient ingredient = new Ingredient(
                dto.getIngredientName(), 
                dto.getCurrentStock(), 
                dto.getUnit(), 
                store
        );

        ingredientRepository.save(ingredient);
        System.out.println("=== 저장된 재료 ID: " + ingredient.getIngredientId() + ", currentStock: " + ingredient.getCurrentStock());
        return ingredient.getIngredientId();
    }

    // 가게의 모든 재료 조회
    public List<Ingredient> getIngredientsByStoreId(Long storeId) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new RuntimeException("가게를 찾을 수 없습니다"));
        return ingredientRepository.findByStore(store);
    }

    // 재고 추가
    @Transactional
    public void addStock(Double willAddStock, Long ingredientId) {
        Ingredient ingredient = ingredientRepository.findById(ingredientId)
                .orElseThrow(() -> new RuntimeException("재료 없음"));
        ingredient.addStock(willAddStock);
    }

    // 재료 수정
    @Transactional
    public void updateIngredient(Long ingredientId, String ingredientName, 
                                Double ingredientStock, String ingredientUnit) {
        System.out.println("=== 재료 수정 - 받은 ingredientStock: " + ingredientStock + " (타입: " + ingredientStock.getClass().getName() + ")");
        Ingredient ingredient = ingredientRepository.findById(ingredientId)
                .orElseThrow(() -> new RuntimeException("재료 없음"));
        ingredient.updateIngredient(ingredientName, ingredientStock, ingredientUnit);
        System.out.println("=== 수정 후 재료 ID: " + ingredient.getIngredientId() + ", currentStock: " + ingredient.getCurrentStock());
    }

    // 재료 삭제
    @Transactional
    public void deleteIngredient(Long ingredientId) {
        Ingredient ingredient = ingredientRepository.findById(ingredientId)
                .orElseThrow(() -> new RuntimeException("재료 없음"));
        ingredientRepository.delete(ingredient);
    }
}