package com.storeos.api.service;

import com.storeos.api.entity.*;
import com.storeos.api.repository.*;
import com.storeos.api.dto.CreateRecipeRequest;
import com.storeos.api.dto.RecipeItemRequest;
import com.storeos.api.dto.RecipeResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class RecipeService {
    private final RecipeRepository recipeRepository;
    private final ProductRepository productRepository;
    private final IngredientRepository ingredientRepository;
    private final StoreRepository storeRepository;

    // 레시피 생성
    @Transactional
    public Long createRecipe(CreateRecipeRequest dto) {
        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("상품 없음"));
        Ingredient ingredient = ingredientRepository.findById(dto.getIngredientId())
                .orElseThrow(() -> new RuntimeException("재료 없음"));
        Recipe recipe = new Recipe(dto.getQuantity(), product, ingredient);

        recipeRepository.save(recipe);
        return recipe.getRecipeId();
    }

    // 가게의 모든 레시피 조회
    public List<RecipeResponse> getRecipesByStoreId(Long storeId) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new RuntimeException("가게를 찾을 수 없습니다"));
        
        // 가게의 모든 상품을 찾고, 그 상품들의 레시피를 조회
        List<Recipe> recipes = recipeRepository.findByProductCategoryStoreStoreId(storeId);
        
        // Recipe 엔티티를 RecipeResponse DTO로 변환
        return recipes.stream()
                .map(recipe -> new RecipeResponse(
                        recipe.getRecipeId(),
                        recipe.getQuantity(),
                        recipe.getProduct().getProductId(),
                        recipe.getIngredient().getIngredientId()
                ))
                .collect(Collectors.toList());
    }

    // 레시피 수정
    @Transactional
    public void updateRecipe(Long recipeId, Integer quantity) {
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new RuntimeException("레시피 없음"));
        recipe.updateQuantity(quantity);
    }

    // 레시피 삭제
    @Transactional
    public void deleteRecipe(Long recipeId) {
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new RuntimeException("레시피 없음"));
        recipeRepository.delete(recipe);
    }

    // 상품 판매 시 레시피를 기반으로 재고 감소
    @Transactional
    public void decreaseStockByRecipe(Long productId, Integer quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("상품 없음"));
        List<Recipe> recipes = recipeRepository.findByProduct(product);

        for (Recipe recipe : recipes) {
            Ingredient ingredient = recipe.getIngredient();
            int totalUsage = recipe.getQuantity() * quantity;
            ingredient.removeStock(totalUsage);
        }
    }

    // 상품의 여러 재료 레시피 한 번에 추가
    @Transactional
    public void createProductRecipes(Long productId, List<RecipeItemRequest> recipes) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("상품 없음"));
        
        for (RecipeItemRequest recipeItem : recipes) {
            Ingredient ingredient = ingredientRepository.findById(recipeItem.getIngredientId())
                    .orElseThrow(() -> new RuntimeException("재료 없음"));
            Recipe recipe = new Recipe(recipeItem.getQuantity(), product, ingredient);
            recipeRepository.save(recipe);
        }
    }

    // 상품의 레시피 전체 업데이트 (기존 삭제 후 새로 추가)
    @Transactional
    public void updateProductRecipes(Long productId, List<RecipeItemRequest> recipes) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("상품 없음"));
        
        // 기존 레시피 모두 삭제
        List<Recipe> existingRecipes = recipeRepository.findByProduct(product);
        recipeRepository.deleteAll(existingRecipes);
        
        // 새 레시피 추가
        for (RecipeItemRequest recipeItem : recipes) {
            Ingredient ingredient = ingredientRepository.findById(recipeItem.getIngredientId())
                    .orElseThrow(() -> new RuntimeException("재료 없음"));
            Recipe recipe = new Recipe(recipeItem.getQuantity(), product, ingredient);
            recipeRepository.save(recipe);
        }
    }

    // 상품의 모든 레시피 삭제
    @Transactional
    public void deleteProductRecipes(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("상품 없음"));
        
        List<Recipe> recipes = recipeRepository.findByProduct(product);
        recipeRepository.deleteAll(recipes);
    }
}
