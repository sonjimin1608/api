package com.storeos.api.service;

import com.storeos.api.entity.*;
import com.storeos.api.repository.*;
import com.storeos.api.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional (readOnly = true)
@RequiredArgsConstructor

public class InventoryService {
    private final RecipeRepository recipeRepository;
    private final IngredientRepository ingredientRepository;
    private final ProductRepository productRepository;

    private final StoreRepository storeRepository;

    @Transactional
    public Long registerIngredient(CreateIngredientRequest dto, Long storeId){
        Store store = storeRepository.findById(storeId).orElseThrow(() -> new RuntimeException("가게 없음"));
        Ingredient ingredient = new Ingredient(dto.getIngredientName(), dto.getCurrentStock(), dto.getUnit(), store);

        ingredientRepository.save(ingredient);
        return ingredient.getIngredientId();
    }

    @Transactional
    public void addStock(Integer willAddStock, Long ingredientId){
        Ingredient ingredient = ingredientRepository.findById(ingredientId).orElseThrow(() -> new RuntimeException("재료 없음"));
        ingredient.addStock(willAddStock);
    }

    @Transactional
    public Long createRecipe(CreateRecipeRequest dto){
        Product product = productRepository.findById(dto.getProductId()).orElseThrow(() -> new RuntimeException("상품 없음"));
        Ingredient ingredient = ingredientRepository.findById(dto.getIngredientId()).orElseThrow(() -> new RuntimeException("재료 없음"));
        Recipe recipe = new Recipe(dto.getQuantity(), product, ingredient);

        recipeRepository.save(recipe);
        return recipe.getRecipeId();
    }
    
    @Transactional
    public void decreaseStock(Long productId, Integer quantity){
        Product product = productRepository.findById(productId).orElseThrow(() -> new RuntimeException("상품 없음"));
        List<Recipe> recipes = recipeRepository.findByProduct(product);

        for (Recipe recipe : recipes){
            Ingredient ingredient = recipe.getIngredient();
            int totalUsage = recipe.getQuantity() * quantity;

            ingredient.removeStock(totalUsage);
        }
    }

}
