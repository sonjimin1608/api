package com.storeos.api.controller;

import com.storeos.api.dto.CreateIngredientRequest;
import com.storeos.api.dto.CreateRecipeRequest;
import com.storeos.api.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "http://localhost:5173") // 👈 이거 추가! (프론트 주소 허용)
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    // 1. 재료 등록 (예: 원두, 우유, 시럽)
    @PostMapping("/stores/{storeId}/ingredients")
    public ResponseEntity<Long> registerIngredient(@PathVariable Long storeId,
                                                   @RequestBody CreateIngredientRequest dto) {
        Long ingredientId = inventoryService.registerIngredient(dto, storeId);
        return ResponseEntity.status(HttpStatus.CREATED).body(ingredientId);
    }

    // 2. 레시피 등록 (상품과 재료 연결)
    @PostMapping("/recipes")
    public ResponseEntity<Void> registerRecipe(@RequestBody CreateRecipeRequest dto) {
        inventoryService.createRecipe(dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}