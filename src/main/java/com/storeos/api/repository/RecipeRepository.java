package com.storeos.api.repository;

import com.storeos.api.entity.Recipe;
import com.storeos.api.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;


@Repository
public interface RecipeRepository extends JpaRepository<Recipe, Long> {
    List <Recipe> findByProduct(Product product);
}