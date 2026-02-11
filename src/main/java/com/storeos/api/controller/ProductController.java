package com.storeos.api.controller;

import com.storeos.api.dto.CreateCategoryRequest;
import com.storeos.api.dto.CreateProductRequest;
import com.storeos.api.entity.ProductStatus;
import com.storeos.api.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController 
@RequestMapping("/api/v1")
@CrossOrigin(origins = "http://localhost:5173") // 👈 이거 추가! (프론트 주소 허용)
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // 1. 카테고리 생성
    @PostMapping("/stores/{storeId}/categories")
    public ResponseEntity<Long> createCategory(@PathVariable Long storeId,
                                               @RequestBody CreateCategoryRequest dto) {
        Long categoryId = productService.createCategory(dto, storeId);
        return ResponseEntity.status(HttpStatus.CREATED).body(categoryId);
    }

    // 2. 상품 등록
    @PostMapping("/categories/{categoryId}/products")
    public ResponseEntity<Long> registerProduct(@PathVariable Long categoryId,
                                                @RequestBody CreateProductRequest dto) {
        Long productId = productService.registerProduct(dto, categoryId);
        return ResponseEntity.status(HttpStatus.CREATED).body(productId);
    }

    // 3. 상품 상태 변경
    @PatchMapping("/products/{productId}/status")
    public ResponseEntity<Void> updateProductStatus(@PathVariable Long productId,
                                                    @RequestParam ProductStatus status) {
        productService.updateProductStatus(productId, status);
        return ResponseEntity.ok().build();
    }

    // 4. 가게의 모든 상품 조회
    @GetMapping("/stores/{storeId}/products")
    public ResponseEntity<?> getProductsByStore(@PathVariable Long storeId) {
        return ResponseEntity.ok(productService.getProductsByStoreId(storeId));
    }

    // 5. 상품 수정
    @PutMapping("/products/{productId}")
    public ResponseEntity<Void> updateProduct(@PathVariable Long productId,
                                             @RequestParam String productName,
                                             @RequestParam Integer productPrice) {
        productService.updateProduct(productId, productName, productPrice);
        return ResponseEntity.ok().build();
    }

    // 6. 상품 삭제
    @DeleteMapping("/products/{productId}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long productId) {
        productService.deleteProduct(productId);
        return ResponseEntity.ok().build();
    }
}