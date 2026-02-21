package com.storeos.api.service;

import com.storeos.api.entity.*;
import com.storeos.api.repository.*;
import com.storeos.api.dto.CreateProductRequest;
import com.storeos.api.dto.ProductResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional (readOnly = true)
@RequiredArgsConstructor

public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final StoreRepository storeRepository;

    @Transactional
    public Long registerProduct(CreateProductRequest dto, Long CategoryId){
        Category category = categoryRepository.findById(CategoryId).orElseThrow(() -> new RuntimeException("카테고리 없음"));
        Product product = new Product(
            dto.getProductName(),
            dto.getProductPrice(),
            category
        );
        productRepository.save(product);

        return product.getProductId();
    }

    @Transactional
    public void updateProductStatus(Long productId, ProductStatus status){
        Product product = productRepository.findById(productId).orElseThrow(() -> new RuntimeException("제품 없음"));
        product.changeProductStatus(status);
    }

    // 가게의 모든 상품 조회
    public List<ProductResponse> getProductsByStoreId(Long storeId) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new RuntimeException("가게를 찾을 수 없습니다"));
        List<Category> categories = categoryRepository.findByStore(store);
        
        // Product 엔티티를 ProductResponse DTO로 변환
        return categories.stream()
                .flatMap(category -> productRepository.findByCategory(category).stream())
                .map(product -> new ProductResponse(
                        product.getProductId(),
                        product.getProductName(),
                        product.getProductPrice(),
                        product.getProductStatus(),
                        product.getCategory().getCategoryId()
                ))
                .collect(Collectors.toList());
    }

    // 상품 수정
    @Transactional
    public void updateProduct(Long productId, String productName, Integer productPrice) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("제품 없음"));
        product.updateProduct(productName, productPrice);
    }

    // 상품 삭제
    @Transactional
    public void deleteProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("제품 없음"));
        productRepository.delete(product);
    }
}
