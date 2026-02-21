package com.storeos.api.controller;

import com.storeos.api.dto.CreateIngredientRequest;
import com.storeos.api.service.IngredientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class InventoryController {

    private final IngredientService ingredientService;

    // 1. 재료 등록
    @PostMapping("/stores/{storeId}/ingredients")
    public ResponseEntity<Long> registerIngredient(@PathVariable Long storeId,
                                                   @RequestBody CreateIngredientRequest dto) {
        Long ingredientId = ingredientService.registerIngredient(dto, storeId);
        return ResponseEntity.status(HttpStatus.CREATED).body(ingredientId);
    }

    // 2. 가게의 모든 재료 조회
    @GetMapping("/stores/{storeId}/ingredients")
    public ResponseEntity<?> getIngredientsByStore(@PathVariable Long storeId) {
        return ResponseEntity.ok(ingredientService.getIngredientsByStoreId(storeId));
    }

    // 3. 재고 추가
    @PatchMapping("/ingredients/{ingredientId}/add-stock")
    public ResponseEntity<Void> addStock(@PathVariable Long ingredientId,
                                        @RequestParam Integer quantity) {
        ingredientService.addStock(quantity, ingredientId);
        return ResponseEntity.ok().build();
    }

    // 4. 재료 수정
    @PutMapping("/ingredients/{ingredientId}")
    public ResponseEntity<Void> updateIngredient(@PathVariable Long ingredientId,
                                                @RequestParam String ingredientName,
                                                @RequestParam Integer ingredientStock,
                                                @RequestParam String ingredientUnit) {
        ingredientService.updateIngredient(ingredientId, ingredientName, ingredientStock, ingredientUnit);
        return ResponseEntity.ok().build();
    }

    // 5. 재료 삭제
    @DeleteMapping("/ingredients/{ingredientId}")
    public ResponseEntity<Void> deleteIngredient(@PathVariable Long ingredientId) {
        ingredientService.deleteIngredient(ingredientId);
        return ResponseEntity.ok().build();
    }
}
