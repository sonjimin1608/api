package com.storeos.api.controller;

import com.storeos.api.dto.CreateRecipeRequest;
import com.storeos.api.dto.RecipeItemRequest;
import com.storeos.api.service.RecipeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class RecipeController {

    private final RecipeService recipeService;

    // 1. 레시피 생성
    @PostMapping("/recipes")
    public ResponseEntity<Long> createRecipe(@RequestBody CreateRecipeRequest dto) {
        Long recipeId = recipeService.createRecipe(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(recipeId);
    }

    // 2. 가게의 모든 레시피 조회
    @GetMapping("/stores/{storeId}/recipes")
    public ResponseEntity<?> getRecipesByStore(@PathVariable Long storeId) {
        return ResponseEntity.ok(recipeService.getRecipesByStoreId(storeId));
    }

    // 3. 레시피 수정
    @PutMapping("/recipes/{recipeId}")
    public ResponseEntity<Void> updateRecipe(@PathVariable Long recipeId,
                                            @RequestParam Double quantity) {
        recipeService.updateRecipe(recipeId, quantity);
        return ResponseEntity.ok().build();
    }

    // 4. 레시피 삭제
    @DeleteMapping("/recipes/{recipeId}")
    public ResponseEntity<Void> deleteRecipe(@PathVariable Long recipeId) {
        recipeService.deleteRecipe(recipeId);
        return ResponseEntity.ok().build();
    }

    // 5. 상품의 여러 재료 레시피 한 번에 추가
    @PostMapping("/products/{productId}/recipes")
    public ResponseEntity<Void> createProductRecipes(@PathVariable Long productId,
                                                     @RequestBody List<RecipeItemRequest> recipes) {
        recipeService.createProductRecipes(productId, recipes);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // 6. 상품의 레시피 전체 업데이트 (기존 삭제 후 새로 추가)
    @PutMapping("/products/{productId}/recipes")
    public ResponseEntity<Void> updateProductRecipes(@PathVariable Long productId,
                                                     @RequestBody List<RecipeItemRequest> recipes) {
        recipeService.updateProductRecipes(productId, recipes);
        return ResponseEntity.ok().build();
    }

    // 7. 상품의 모든 레시피 삭제
    @DeleteMapping("/products/{productId}/recipes")
    public ResponseEntity<Void> deleteProductRecipes(@PathVariable Long productId) {
        recipeService.deleteProductRecipes(productId);
        return ResponseEntity.ok().build();
    }
}
