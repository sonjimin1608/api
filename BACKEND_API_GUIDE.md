# 백엔드 API 수정 가이드라인

프런트엔드에서 카테고리, 상품, 재고, 레시피 관리 기능을 사용하기 위해 아래 API 엔드포인트들이 필요합니다.

## 📋 1. 카테고리 관리 API

### 이미 구현된 API
- ✅ `POST /api/v1/stores/{storeId}/categories` - 카테고리 생성

### 추가로 필요한 API

#### 1.1 카테고리 목록 조회
```java
@GetMapping("/stores/{storeId}/categories")
public ResponseEntity<List<CategoryResponse>> getCategories(@PathVariable Long storeId) {
    return ResponseEntity.ok(productService.getCategoriesByStoreId(storeId));
}
```

**응답 예시:**
```json
[
  {
    "categoryId": 1,
    "categoryName": "음료",
    "storeId": 1
  },
  {
    "categoryId": 2,
    "categoryName": "디저트",
    "storeId": 1
  }
]
```

#### 1.2 카테고리 수정
```java
@PutMapping("/categories/{categoryId}")
public ResponseEntity<Void> updateCategory(@PathVariable Long categoryId,
                                          @RequestParam String categoryName) {
    productService.updateCategory(categoryId, categoryName);
    return ResponseEntity.ok().build();
}
```

#### 1.3 카테고리 삭제
```java
@DeleteMapping("/categories/{categoryId}")
public ResponseEntity<Void> deleteCategory(@PathVariable Long categoryId) {
    productService.deleteCategory(categoryId);
    return ResponseEntity.ok().build();
}
```

---

## 🍽️ 2. 상품 관리 API

### 이미 구현된 API
- ✅ `POST /categories/{categoryId}/products` - 상품 등록
- ✅ `GET /stores/{storeId}/products` - 상품 목록 조회
- ✅ `PUT /products/{productId}` - 상품 수정
- ✅ `DELETE /products/{productId}` - 상품 삭제
- ✅ `PATCH /products/{productId}/status` - 상품 상태 변경

### 추가 권장 사항
- 상품 조회 시 카테고리 정보도 함께 반환하면 좋습니다.

**개선된 응답 예시:**
```json
[
  {
    "productId": 1,
    "productName": "아메리카노",
    "productPrice": 4500,
    "productStatus": "SALE",
    "categoryId": 1,
    "categoryName": "음료"
  }
]
```

---

## 📦 3. 재고(재료) 관리 API

### 이미 구현된 API
- ✅ `POST /api/v1/stores/{storeId}/ingredients` - 재료 등록

### 추가로 필요한 API

#### 3.1 재료 목록 조회
```java
@GetMapping("/stores/{storeId}/ingredients")
public ResponseEntity<List<IngredientResponse>> getIngredients(@PathVariable Long storeId) {
    return ResponseEntity.ok(inventoryService.getIngredientsByStoreId(storeId));
}
```

**응답 예시:**
```json
[
  {
    "ingredientId": 1,
    "ingredientName": "원두",
    "ingredientStock": 5000,
    "ingredientUnit": "g",
    "storeId": 1
  },
  {
    "ingredientId": 2,
    "ingredientName": "우유",
    "ingredientStock": 10000,
    "ingredientUnit": "ml",
    "storeId": 1
  }
]
```

#### 3.2 재료 수정
```java
@PutMapping("/ingredients/{ingredientId}")
public ResponseEntity<Void> updateIngredient(@PathVariable Long ingredientId,
                                            @RequestParam String ingredientName,
                                            @RequestParam Integer ingredientStock,
                                            @RequestParam String ingredientUnit) {
    inventoryService.updateIngredient(ingredientId, ingredientName, ingredientStock, ingredientUnit);
    return ResponseEntity.ok().build();
}
```

#### 3.3 재료 삭제
```java
@DeleteMapping("/ingredients/{ingredientId}")
public ResponseEntity<Void> deleteIngredient(@PathVariable Long ingredientId) {
    inventoryService.deleteIngredient(ingredientId);
    return ResponseEntity.ok().build();
}
```

---

## 📝 4. 레시피 관리 API

### 이미 구현된 API
- ✅ `POST /api/v1/recipes` - 레시피 등록

### 추가로 필요한 API

#### 4.1 레시피 목록 조회
```java
@GetMapping("/stores/{storeId}/recipes")
public ResponseEntity<List<RecipeResponse>> getRecipes(@PathVariable Long storeId) {
    return ResponseEntity.ok(inventoryService.getRecipesByStoreId(storeId));
}
```

**응답 예시:**
```json
[
  {
    "recipeId": 1,
    "productId": 1,
    "productName": "아메리카노",
    "ingredientId": 1,
    "ingredientName": "원두",
    "requiredQty": 15
  },
  {
    "recipeId": 2,
    "productId": 2,
    "productName": "카페라떼",
    "ingredientId": 1,
    "ingredientName": "원두",
    "requiredQty": 15
  }
]
```

#### 4.2 레시피 수정
```java
@PutMapping("/recipes/{recipeId}")
public ResponseEntity<Void> updateRecipe(@PathVariable Long recipeId,
                                        @RequestParam Integer requiredQty) {
    inventoryService.updateRecipe(recipeId, requiredQty);
    return ResponseEntity.ok().build();
}
```

#### 4.3 레시피 삭제
```java
@DeleteMapping("/recipes/{recipeId}")
public ResponseEntity<Void> deleteRecipe(@PathVariable Long recipeId) {
    inventoryService.deleteRecipe(recipeId);
    return ResponseEntity.ok().build();
}
```

---

## 🔧 구현 순서 권장사항

### 1단계: 조회 API 추가
가장 먼저 각 리소스의 조회 API를 추가하여 프런트엔드에서 데이터를 확인할 수 있도록 합니다.
- `GET /stores/{storeId}/categories`
- `GET /stores/{storeId}/ingredients`
- `GET /stores/{storeId}/recipes`

### 2단계: 수정 API 추가
각 리소스의 수정 API를 추가합니다.
- `PUT /categories/{categoryId}`
- `PUT /ingredients/{ingredientId}`
- `PUT /recipes/{recipeId}`

### 3단계: 삭제 API 추가
각 리소스의 삭제 API를 추가합니다.
- `DELETE /categories/{categoryId}`
- `DELETE /ingredients/{ingredientId}`
- `DELETE /recipes/{recipeId}`

---

## 📝 Service 레이어 구현 예시

### ProductService (카테고리 관련)
```java
public List<CategoryResponse> getCategoriesByStoreId(Long storeId) {
    return categoryRepository.findByStoreStoreId(storeId)
        .stream()
        .map(this::toCategoryResponse)
        .collect(Collectors.toList());
}

public void updateCategory(Long categoryId, String categoryName) {
    Category category = categoryRepository.findById(categoryId)
        .orElseThrow(() -> new RuntimeException("Category not found"));
    category.setCategoryName(categoryName);
    categoryRepository.save(category);
}

public void deleteCategory(Long categoryId) {
    categoryRepository.deleteById(categoryId);
}
```

### InventoryService (재료 관련)
```java
public List<IngredientResponse> getIngredientsByStoreId(Long storeId) {
    return ingredientRepository.findByStoreStoreId(storeId)
        .stream()
        .map(this::toIngredientResponse)
        .collect(Collectors.toList());
}

public void updateIngredient(Long ingredientId, String ingredientName, 
                            Integer ingredientStock, String ingredientUnit) {
    Ingredient ingredient = ingredientRepository.findById(ingredientId)
        .orElseThrow(() -> new RuntimeException("Ingredient not found"));
    ingredient.setIngredientName(ingredientName);
    ingredient.setIngredientStock(ingredientStock);
    ingredient.setIngredientUnit(ingredientUnit);
    ingredientRepository.save(ingredient);
}

public void deleteIngredient(Long ingredientId) {
    ingredientRepository.deleteById(ingredientId);
}
```

### InventoryService (레시피 관련)
```java
public List<RecipeResponse> getRecipesByStoreId(Long storeId) {
    // 해당 가게의 상품들에 연결된 레시피를 조회
    return recipeRepository.findByProductStoreStoreId(storeId)
        .stream()
        .map(this::toRecipeResponse)
        .collect(Collectors.toList());
}

public void updateRecipe(Long recipeId, Integer requiredQty) {
    Recipe recipe = recipeRepository.findById(recipeId)
        .orElseThrow(() -> new RuntimeException("Recipe not found"));
    recipe.setRequiredQty(requiredQty);
    recipeRepository.save(recipe);
}

public void deleteRecipe(Long recipeId) {
    recipeRepository.deleteById(recipeId);
}
```

---

## ⚠️ 주의사항

### 1. CORS 설정
모든 컨트롤러에 다음 어노테이션이 포함되어 있는지 확인하세요:
```java
@CrossOrigin(origins = "http://localhost:5173")
```

### 2. 삭제 시 참조 무결성
- 카테고리 삭제 시: 해당 카테고리에 속한 상품이 있으면 삭제 불가 (또는 CASCADE 설정)
- 상품 삭제 시: 해당 상품에 연결된 레시피가 있으면 삭제 불가 (또는 CASCADE 설정)
- 재료 삭제 시: 해당 재료를 사용하는 레시피가 있으면 삭제 불가 (또는 CASCADE 설정)

### 3. 에러 처리
GlobalExceptionHandler에서 다음 예외들을 처리하세요:
- `EntityNotFoundException`: 리소스를 찾을 수 없을 때
- `DataIntegrityViolationException`: 참조 무결성 위반 시
- `IllegalArgumentException`: 잘못된 입력값

### 4. Response DTO 생성
조회 API에서 반환할 DTO 클래스들을 생성하세요:
- `CategoryResponse`
- `IngredientResponse`
- `RecipeResponse` (productName, ingredientName 포함)

---

## 🚀 테스트 방법

백엔드 API를 구현한 후, 다음 순서로 테스트하세요:

1. **카테고리 추가** → 카테고리 목록 조회로 확인
2. **상품 추가** (카테고리 선택) → 상품 목록 조회로 확인
3. **재료 추가** → 재료 목록 조회로 확인
4. **레시피 추가** (상품과 재료 연결) → 레시피 목록 조회로 확인
5. 각 리소스 **수정 및 삭제** 기능 테스트

---

## 📚 참고: API 엔드포인트 요약

| 기능 | HTTP 메서드 | 엔드포인트 | 상태 |
|------|------------|-----------|------|
| 카테고리 생성 | POST | `/stores/{storeId}/categories` | ✅ 구현됨 |
| 카테고리 조회 | GET | `/stores/{storeId}/categories` | ❌ 필요 |
| 카테고리 수정 | PUT | `/categories/{categoryId}` | ❌ 필요 |
| 카테고리 삭제 | DELETE | `/categories/{categoryId}` | ❌ 필요 |
| 상품 생성 | POST | `/categories/{categoryId}/products` | ✅ 구현됨 |
| 상품 조회 | GET | `/stores/{storeId}/products` | ✅ 구현됨 |
| 상품 수정 | PUT | `/products/{productId}` | ✅ 구현됨 |
| 상품 삭제 | DELETE | `/products/{productId}` | ✅ 구현됨 |
| 재료 생성 | POST | `/stores/{storeId}/ingredients` | ✅ 구현됨 |
| 재료 조회 | GET | `/stores/{storeId}/ingredients` | ❌ 필요 |
| 재료 수정 | PUT | `/ingredients/{ingredientId}` | ❌ 필요 |
| 재료 삭제 | DELETE | `/ingredients/{ingredientId}` | ❌ 필요 |
| 레시피 생성 | POST | `/recipes` | ✅ 구현됨 |
| 레시피 조회 | GET | `/stores/{storeId}/recipes` | ❌ 필요 |
| 레시피 수정 | PUT | `/recipes/{recipeId}` | ❌ 필요 |
| 레시피 삭제 | DELETE | `/recipes/{recipeId}` | ❌ 필요 |

---

이 가이드를 따라 백엔드 API를 구현하면 프런트엔드의 모든 기능이 정상적으로 동작할 것입니다.
