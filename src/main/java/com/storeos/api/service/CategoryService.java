package com.storeos.api.service;

import com.storeos.api.entity.*;
import com.storeos.api.repository.*;
import com.storeos.api.dto.CreateCategoryRequest;
import com.storeos.api.dto.CategoryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final StoreRepository storeRepository;

    // 카테고리 생성
    @Transactional
    public Long createCategory(CreateCategoryRequest dto, Long storeId) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new RuntimeException("가게 없음"));
        Category category = new Category(dto.getCategoryName(), store);
        categoryRepository.save(category);

        return category.getCategoryId();
    }

    // 가게의 모든 카테고리 조회
    public List<CategoryResponse> getCategoriesByStoreId(Long storeId) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new RuntimeException("가게를 찾을 수 없습니다"));
        return categoryRepository.findByStore(store).stream()
                .map(category -> new CategoryResponse(
                        category.getCategoryId(),
                        category.getCategoryName(),
                        category.getStore().getStoreId()
                ))
                .collect(Collectors.toList());
    }

    // 카테고리 수정
    @Transactional
    public void updateCategory(Long categoryId, String categoryName) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("카테고리 없음"));
        category.updateCategoryName(categoryName);
    }

    // 카테고리 삭제
    @Transactional
    public void deleteCategory(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("카테고리 없음"));
        categoryRepository.delete(category);
    }
}
