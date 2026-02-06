package com.storeos.api.service;

import com.storeos.api.entity.*;
import com.storeos.api.repository.*;
import com.storeos.api.dto.CreateCategoryRequest;
import com.storeos.api.dto.CreateProductRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional (readOnly = true)
@RequiredArgsConstructor

public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final StoreRepository storeRepository;

    @Transactional
    public Long createCategory(CreateCategoryRequest dto, Long storeId){
        Store store = storeRepository.findById(storeId).orElseThrow(() -> new RuntimeException("가게 없음"));
        Category category = new Category(dto.getCategoryName(), store);
        categoryRepository.save(category);

        return category.getCategoryId();
    }

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
}
