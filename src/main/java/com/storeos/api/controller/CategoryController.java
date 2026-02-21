package com.storeos.api.controller;

import com.storeos.api.dto.CreateCategoryRequest;
import com.storeos.api.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    // 1. 카테고리 생성
    @PostMapping("/stores/{storeId}/categories")
    public ResponseEntity<Long> createCategory(@PathVariable Long storeId,
                                               @RequestBody CreateCategoryRequest dto) {
        Long categoryId = categoryService.createCategory(dto, storeId);
        return ResponseEntity.status(HttpStatus.CREATED).body(categoryId);
    }

    // 2. 가게의 모든 카테고리 조회
    @GetMapping("/stores/{storeId}/categories")
    public ResponseEntity<?> getCategoriesByStore(@PathVariable Long storeId) {
        return ResponseEntity.ok(categoryService.getCategoriesByStoreId(storeId));
    }

    // 3. 카테고리 수정
    @PutMapping("/categories/{categoryId}")
    public ResponseEntity<Void> updateCategory(@PathVariable Long categoryId,
                                              @RequestParam String categoryName) {
        categoryService.updateCategory(categoryId, categoryName);
        return ResponseEntity.ok().build();
    }

    // 4. 카테고리 삭제
    @DeleteMapping("/categories/{categoryId}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long categoryId) {
        categoryService.deleteCategory(categoryId);
        return ResponseEntity.ok().build();
    }
}
