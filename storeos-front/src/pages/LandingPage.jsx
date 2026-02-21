import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function LandingPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  // 탭 관리
  const [activeTab, setActiveTab] = useState('category'); // category, product, inventory, recipe
  
  // 카테고리 상태
  const [categories, setCategories] = useState([]);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryFormData, setCategoryFormData] = useState({
    categoryName: ''
  });
  
  // 상품 상태
  const [products, setProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    productName: '',
    productPrice: '',
    categoryId: ''
  });

  // 재고(재료) 상태
  const [ingredients, setIngredients] = useState([]);
  const [showAddIngredientModal, setShowAddIngredientModal] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState(null);
  const [ingredientFormData, setIngredientFormData] = useState({
    ingredientName: '',
    currentStock: '',
    Unit: ''
  });

  // 레시피 상태
  const [recipes, setRecipes] = useState([]);
  const [showAddRecipeModal, setShowAddRecipeModal] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [recipeFormData, setRecipeFormData] = useState({
    productId: '',
    recipeItems: [{ ingredientId: '', quantity: '' }]
  });

  // 페이지 로드시 로그인 상태 확인 및 데이터 조회
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      
      // 로그인한 사용자의 가게 데이터 조회
      if (userData.storeId) {
        fetchCategories(userData.storeId);
        fetchProducts(userData.storeId);
        fetchIngredients(userData.storeId);
        fetchRecipes(userData.storeId);
      }
    }
  }, []);

  // ========== 카테고리 관리 ==========
  const fetchCategories = async (storeId) => {
    try {
      console.log('카테고리 조회 시작, storeId:', storeId);
      const response = await api.get(`/stores/${storeId}/categories`);
      console.log('카테고리 조회 응답:', response.data);
      setCategories(response.data);
    } catch (error) {
      console.error('카테고리 조회 실패:', error);
      console.error('에러 상세:', error.response?.data);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!user?.storeId) return;

    try {
      console.log('카테고리 추가 요청:', { categoryName: categoryFormData.categoryName, storeId: user.storeId });
      const response = await api.post(`/stores/${user.storeId}/categories`, {
        categoryName: categoryFormData.categoryName
      });
      console.log('카테고리 추가 응답:', response.data);
      
      alert('카테고리가 추가되었습니다');
      setShowAddCategoryModal(false);
      setCategoryFormData({ categoryName: '' });
      fetchCategories(user.storeId);
    } catch (error) {
      console.error('카테고리 추가 실패:', error);
      console.error('에러 상세:', error.response?.data);
      alert('카테고리 추가에 실패했습니다: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEditCategory = async (e) => {
    e.preventDefault();
    if (!editingCategory) return;

    try {
      const params = new URLSearchParams({
        categoryName: categoryFormData.categoryName
      });

      await api.put(`/categories/${editingCategory.categoryId}?${params.toString()}`);
      
      alert('카테고리가 수정되었습니다');
      setEditingCategory(null);
      setCategoryFormData({ categoryName: '' });
      fetchCategories(user.storeId);
    } catch (error) {
      console.error('카테고리 수정 실패:', error);
      alert('카테고리 수정에 실패했습니다');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!confirm('정말 이 카테고리를 삭제하시겠습니까?')) return;

    try {
      await api.delete(`/categories/${categoryId}`);
      alert('카테고리가 삭제되었습니다');
      fetchCategories(user.storeId);
    } catch (error) {
      console.error('카테고리 삭제 실패:', error);
      alert('카테고리 삭제에 실패했습니다');
    }
  };

  const openEditCategoryModal = (category) => {
    setEditingCategory(category);
    setCategoryFormData({
      categoryName: category.categoryName
    });
  };

  // ========== 상품 관리 ==========
  const fetchProducts = async (storeId) => {
    try {
      const response = await api.get(`/stores/${storeId}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('상품 조회 실패:', error);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!user?.storeId || !formData.categoryId) {
      alert('카테고리를 선택해주세요');
      return;
    }

    try {
      await api.post(`/categories/${formData.categoryId}/products`, {
        productName: formData.productName,
        productPrice: parseInt(formData.productPrice)
      });
      
      alert('상품이 추가되었습니다');
      setShowAddModal(false);
      setFormData({ productName: '', productPrice: '', categoryId: '' });
      fetchProducts(user.storeId);
    } catch (error) {
      console.error('상품 추가 실패:', error);
      alert('상품 추가에 실패했습니다');
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const params = new URLSearchParams({
        productName: formData.productName,
        productPrice: formData.productPrice
      });

      await api.put(`/products/${editingProduct.productId}?${params.toString()}`);
      
      alert('상품이 수정되었습니다');
      setEditingProduct(null);
      setFormData({ productName: '', productPrice: '', categoryId: '' });
      fetchProducts(user.storeId);
    } catch (error) {
      console.error('상품 수정 실패:', error);
      alert('상품 수정에 실패했습니다');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('정말 이 상품을 삭제하시겠습니까?')) return;

    try {
      await api.delete(`/products/${productId}`);
      alert('상품이 삭제되었습니다');
      fetchProducts(user.storeId);
    } catch (error) {
      console.error('상품 삭제 실패:', error);
      alert('상품 삭제에 실패했습니다');
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      productName: product.productName,
      productPrice: product.productPrice,
      categoryId: product.categoryId || ''
    });
  };

  // ========== 재고(재료) 관리 ==========
  const fetchIngredients = async (storeId) => {
    try {
      const response = await api.get(`/stores/${storeId}/ingredients`);
      setIngredients(response.data);
    } catch (error) {
      console.error('재고 조회 실패:', error);
    }
  };

  const handleAddIngredient = async (e) => {
    e.preventDefault();
    if (!user?.storeId) return;

    try {
      await api.post(`/stores/${user.storeId}/ingredients`, {
        ingredientName: ingredientFormData.ingredientName,
        currentStock: parseInt(ingredientFormData.ingredientStock),
        unit: ingredientFormData.ingredientUnit
      });
      
      alert('재료가 추가되었습니다');
      setShowAddIngredientModal(false);
      setIngredientFormData({ ingredientName: '', ingredientStock: '', ingredientUnit: '' });
      fetchIngredients(user.storeId);
    } catch (error) {
      console.error('재료 추가 실패:', error);
      console.error('에러 상세:', error.response?.data);
      alert('재료 추가에 실패했습니다: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEditIngredient = async (e) => {
    e.preventDefault();
    if (!editingIngredient) return;

    try {
      const params = new URLSearchParams({
        ingredientName: ingredientFormData.ingredientName,
        ingredientStock: ingredientFormData.ingredientStock,
        ingredientUnit: ingredientFormData.ingredientUnit
      });

      await api.put(`/ingredients/${editingIngredient.ingredientId}?${params.toString()}`);
      
      alert('재료가 수정되었습니다');
      setEditingIngredient(null);
      setIngredientFormData({ ingredientName: '', ingredientStock: '', ingredientUnit: '' });
      fetchIngredients(user.storeId);
    } catch (error) {
      console.error('재료 수정 실패:', error);
      alert('재료 수정에 실패했습니다');
    }
  };

  const handleDeleteIngredient = async (ingredientId) => {
    if (!confirm('정말 이 재료를 삭제하시겠습니까?')) return;

    try {
      await api.delete(`/ingredients/${ingredientId}`);
      alert('재료가 삭제되었습니다');
      fetchIngredients(user.storeId);
    } catch (error) {
      console.error('재료 삭제 실패:', error);
      alert('재료 삭제에 실패했습니다');
    }
  };

  const openEditIngredientModal = (ingredient) => {
    setEditingIngredient(ingredient);
    setIngredientFormData({
      ingredientName: ingredient.ingredientName,
      ingredientStock: ingredient.currentStock,
      ingredientUnit: ingredient.unit
    });
  };

  // ========== 레시피 관리 ==========
  const fetchRecipes = async (storeId) => {
    try {
      const response = await api.get(`/stores/${storeId}/recipes`);
      setRecipes(response.data);
    } catch (error) {
      console.error('레시피 조회 실패:', error);
    }
  };

  // 레시피를 productId로 그룹화
  const groupRecipesByProduct = () => {
    const grouped = {};
    recipes.forEach(recipe => {
      if (!grouped[recipe.productId]) {
        grouped[recipe.productId] = [];
      }
      grouped[recipe.productId].push(recipe);
    });
    return grouped;
  };

  const handleAddRecipe = async (e) => {
    e.preventDefault();
    if (!recipeFormData.productId || recipeFormData.recipeItems.length === 0) {
      alert('상품과 재료를 선택해주세요');
      return;
    }

    // 빈 재료 항목 확인
    const hasEmptyItems = recipeFormData.recipeItems.some(item => !item.ingredientId || !item.quantity);
    if (hasEmptyItems) {
      alert('모든 재료와 필요량을 입력해주세요');
      return;
    }

    try {
      const recipes = recipeFormData.recipeItems.map(item => ({
        ingredientId: parseInt(item.ingredientId),
        quantity: parseInt(item.quantity)
      }));

      await api.post(`/products/${recipeFormData.productId}/recipes`, recipes);
      
      alert('레시피가 추가되었습니다');
      setShowAddRecipeModal(false);
      setRecipeFormData({ productId: '', recipeItems: [{ ingredientId: '', quantity: '' }] });
      fetchRecipes(user.storeId);
    } catch (error) {
      console.error('레시피 추가 실패:', error);
      alert('레시피 추가에 실패했습니다');
    }
  };

  const handleEditRecipe = async (e) => {
    e.preventDefault();
    if (!editingRecipe) return;

    // 빈 재료 항목 확인
    const hasEmptyItems = recipeFormData.recipeItems.some(item => !item.ingredientId || !item.quantity);
    if (hasEmptyItems) {
      alert('모든 재료와 필요량을 입력해주세요');
      return;
    }

    try {
      const recipes = recipeFormData.recipeItems.map(item => ({
        ingredientId: parseInt(item.ingredientId),
        quantity: parseInt(item.quantity)
      }));

      await api.put(`/products/${editingRecipe}/recipes`, recipes);
      
      alert('레시피가 수정되었습니다');
      setEditingRecipe(null);
      setRecipeFormData({ productId: '', recipeItems: [{ ingredientId: '', quantity: '' }] });
      fetchRecipes(user.storeId);
    } catch (error) {
      console.error('레시피 수정 실패:', error);
      alert('레시피 수정에 실패했습니다');
    }
  };

  const handleDeleteRecipe = async (productId) => {
    if (!confirm('이 상품의 모든 레시피를 삭제하시겠습니까?')) return;

    try {
      await api.delete(`/products/${productId}/recipes`);
      alert('레시피가 삭제되었습니다');
      fetchRecipes(user.storeId);
    } catch (error) {
      console.error('레시피 삭제 실패:', error);
      alert('레시피 삭제에 실패했습니다');
    }
  };

  const openEditRecipeModal = (productId, productRecipes) => {
    setEditingRecipe(productId);
    const recipeItems = productRecipes.map(recipe => ({
      ingredientId: recipe.ingredientId.toString(),
      quantity: recipe.quantity.toString()
    }));
    setRecipeFormData({
      productId: productId.toString(),
      recipeItems: recipeItems
    });
  };

  const addRecipeItem = () => {
    setRecipeFormData({
      ...recipeFormData,
      recipeItems: [...recipeFormData.recipeItems, { ingredientId: '', quantity: '' }]
    });
  };

  const removeRecipeItem = (index) => {
    const newItems = recipeFormData.recipeItems.filter((_, i) => i !== index);
    setRecipeFormData({
      ...recipeFormData,
      recipeItems: newItems.length > 0 ? newItems : [{ ingredientId: '', quantity: '' }]
    });
  };

  const updateRecipeItem = (index, field, value) => {
    const newItems = [...recipeFormData.recipeItems];
    newItems[index][field] = value;
    setRecipeFormData({
      ...recipeFormData,
      recipeItems: newItems
    });
  };

  // 로그아웃 처리
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setProducts([]);
    alert('로그아웃되었습니다');
  };

  return (
    <div style={styles.container}>
      {/* 상단 헤더 */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          {/* 좌측 상단: Store POS */}
          <h1 style={styles.logo} onClick={() => navigate('/')}>
            Store POS
          </h1>

          {/* 우측 상단: 로그인 / 회원가입 또는 사용자 정보 / 로그아웃 */}
          <div style={styles.authNav}>
            {user ? (
              <>
                <span style={styles.userName}>{user.userName}님</span>
                <button 
                  style={styles.logoutBtn} 
                  onClick={handleLogout}
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <button 
                  style={styles.loginBtn} 
                  onClick={() => navigate('/login')}
                >
                  로그인
                </button>
                <button 
                  style={styles.signupBtn} 
                  onClick={() => navigate('/signup')}
                >
                  회원가입
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 - 관리 페이지 */}
      <main style={styles.main}>
        {!user || !user.storeId ? (
          <div style={styles.notLoggedIn}>
            <h2 style={styles.welcomeTitle}>Store POS에 오신 것을 환영합니다</h2>
            <p style={styles.welcomeDesc}>
              간편하게 매장을 관리하고 판매를 기록하세요
            </p>
            <button 
              style={styles.primaryBtn}
              onClick={() => navigate('/login')}
            >
              로그인하기
            </button>
          </div>
        ) : (
          <>
            <div style={styles.titleSection}>
              <h2 style={styles.welcomeTitle}>매장 관리</h2>
              {user.role === 'MANAGER' && (
                <button 
                  style={styles.posBtn}
                  onClick={() => navigate('/pos')}
                >
                  🍽️ POS 화면으로
                </button>
              )}
            </div>

            {/* 탭 네비게이션 */}
            <div style={styles.tabContainer}>
              <button 
                style={{...styles.tab, ...(activeTab === 'category' ? styles.activeTab : {})}}
                onClick={() => setActiveTab('category')}
              >
                📋 카테고리 관리
              </button>
              <button 
                style={{...styles.tab, ...(activeTab === 'product' ? styles.activeTab : {})}}
                onClick={() => setActiveTab('product')}
              >
                🍽️ 상품 관리
              </button>
              <button 
                style={{...styles.tab, ...(activeTab === 'inventory' ? styles.activeTab : {})}}
                onClick={() => setActiveTab('inventory')}
              >
                📦 재고 관리
              </button>
              <button 
                style={{...styles.tab, ...(activeTab === 'recipe' ? styles.activeTab : {})}}
                onClick={() => setActiveTab('recipe')}
              >
                📝 레시피 관리
              </button>
            </div>

            {/* 카테고리 관리 */}
            {activeTab === 'category' && (
              <div style={styles.menuContainer}>
                <div style={styles.menuHeader}>
                  <h3 style={styles.menuHeaderTitle}>카테고리 목록</h3>
                  <button 
                    style={styles.addMenuBtn}
                    onClick={() => setShowAddCategoryModal(true)}
                  >
                    + 카테고리 추가
                  </button>
                </div>

                <div style={styles.menuGrid}>
                  {categories.length === 0 ? (
                    <p style={styles.emptyMessage}>등록된 카테고리가 없습니다. 카테고리를 추가해보세요!</p>
                  ) : (
                    categories.map((category) => (
                      <div key={category.categoryId} style={styles.menuCard}>
                        <div style={styles.menuImage}>
                          <span style={styles.menuImagePlaceholder}>📋</span>
                        </div>
                        <div style={styles.menuInfo}>
                          <h4 style={styles.menuName}>{category.categoryName}</h4>
                        </div>
                        <div style={styles.menuActions}>
                          <button 
                            style={styles.editBtn}
                            onClick={() => openEditCategoryModal(category)}
                          >
                            수정
                          </button>
                          <button 
                            style={styles.deleteBtn}
                            onClick={() => handleDeleteCategory(category.categoryId)}
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
            
            {/* 상품 관리 */}
            {activeTab === 'product' && (
              <div style={styles.menuContainer}>
                <div style={styles.menuHeader}>
                  <h3 style={styles.menuHeaderTitle}>상품 목록</h3>
                  <button 
                    style={styles.addMenuBtn}
                    onClick={() => setShowAddModal(true)}
                  >
                    + 상품 추가
                  </button>
                </div>

                <div style={styles.menuGrid}>
                  {products.length === 0 ? (
                    <p style={styles.emptyMessage}>등록된 상품이 없습니다. 상품을 추가해보세요!</p>
                  ) : (
                    products.map((product) => (
                      <div key={product.productId} style={styles.menuCard}>
                        <div style={styles.menuImage}>
                          <span style={styles.menuImagePlaceholder}>🍽️</span>
                        </div>
                        <div style={styles.menuInfo}>
                          <h4 style={styles.menuName}>{product.productName}</h4>
                          <p style={styles.menuPrice}>{product.productPrice.toLocaleString()}원</p>
                          <p style={styles.menuDesc}>
                            {product.productStatus === 'SALE' ? '판매중' : '품절'}
                          </p>
                        </div>
                        <div style={styles.menuActions}>
                          <button 
                            style={styles.editBtn}
                            onClick={() => openEditModal(product)}
                          >
                            수정
                          </button>
                          <button 
                            style={styles.deleteBtn}
                            onClick={() => handleDeleteProduct(product.productId)}
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* 재고 관리 */}
            {activeTab === 'inventory' && (
              <div style={styles.menuContainer}>
                <div style={styles.menuHeader}>
                  <h3 style={styles.menuHeaderTitle}>재료 목록</h3>
                  <button 
                    style={styles.addMenuBtn}
                    onClick={() => setShowAddIngredientModal(true)}
                  >
                    + 재료 추가
                  </button>
                </div>

                <div style={styles.menuGrid}>
                  {ingredients.length === 0 ? (
                    <p style={styles.emptyMessage}>등록된 재료가 없습니다. 재료를 추가해보세요!</p>
                  ) : (
                    ingredients.map((ingredient) => (
                      <div key={ingredient.ingredientId} style={styles.menuCard}>
                        <div style={styles.menuImage}>
                          <span style={styles.menuImagePlaceholder}>📦</span>
                        </div>
                        <div style={styles.menuInfo}>
                          <h4 style={styles.menuName}>{ingredient.ingredientName}</h4>
                          <p style={styles.menuPrice}>재고: {ingredient.currentStock} {ingredient.unit}</p>
                        </div>
                        <div style={styles.menuActions}>
                          <button 
                            style={styles.editBtn}
                            onClick={() => openEditIngredientModal(ingredient)}
                          >
                            수정
                          </button>
                          <button 
                            style={styles.deleteBtn}
                            onClick={() => handleDeleteIngredient(ingredient.ingredientId)}
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* 레시피 관리 */}
            {activeTab === 'recipe' && (
              <div style={styles.menuContainer}>
                <div style={styles.menuHeader}>
                  <h3 style={styles.menuHeaderTitle}>레시피 목록</h3>
                  <button 
                    style={styles.addMenuBtn}
                    onClick={() => setShowAddRecipeModal(true)}
                  >
                    + 레시피 추가
                  </button>
                </div>

                <div style={styles.menuGrid}>
                  {recipes.length === 0 ? (
                    <p style={styles.emptyMessage}>등록된 레시피가 없습니다. 레시피를 추가해보세요!</p>
                  ) : (
                    Object.entries(groupRecipesByProduct()).map(([productId, productRecipes]) => {
                      const product = products.find(p => p.productId === parseInt(productId));
                      return (
                        <div key={productId} style={styles.menuCard}>
                          <div style={styles.menuImage}>
                            <span style={styles.menuImagePlaceholder}>📝</span>
                          </div>
                          <div style={styles.menuInfo}>
                            <h4 style={styles.menuName}>
                              {product?.productName || '상품'}
                            </h4>
                            <p style={styles.menuDesc}>레시피:</p>
                            <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                              {productRecipes.map(recipe => {
                                const ingredient = ingredients.find(i => i.ingredientId === recipe.ingredientId);
                                return (
                                  <li key={recipe.recipeId} style={{ fontSize: '14px', marginBottom: '4px' }}>
                                    {ingredient?.ingredientName || '재료'}: {recipe.quantity}
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                          <div style={styles.menuActions}>
                            <button 
                              style={styles.editBtn}
                              onClick={() => openEditRecipeModal(parseInt(productId), productRecipes)}
                            >
                              수정
                            </button>
                            <button 
                              style={styles.deleteBtn}
                              onClick={() => handleDeleteRecipe(parseInt(productId))}
                            >
                              삭제
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* 카테고리 추가 모달 */}
      {showAddCategoryModal && (
        <div style={styles.modalOverlay} onClick={() => setShowAddCategoryModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>카테고리 추가</h3>
            <form onSubmit={handleAddCategory}>
              <input
                type="text"
                placeholder="카테고리 이름"
                value={categoryFormData.categoryName}
                onChange={(e) => setCategoryFormData({...categoryFormData, categoryName: e.target.value})}
                style={styles.input}
                required
              />
              <div style={styles.modalActions}>
                <button type="button" style={styles.cancelBtn} onClick={() => setShowAddCategoryModal(false)}>
                  취소
                </button>
                <button type="submit" style={styles.submitBtn}>
                  추가
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 카테고리 수정 모달 */}
      {editingCategory && (
        <div style={styles.modalOverlay} onClick={() => setEditingCategory(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>카테고리 수정</h3>
            <form onSubmit={handleEditCategory}>
              <input
                type="text"
                placeholder="카테고리 이름"
                value={categoryFormData.categoryName}
                onChange={(e) => setCategoryFormData({...categoryFormData, categoryName: e.target.value})}
                style={styles.input}
                required
              />
              <div style={styles.modalActions}>
                <button type="button" style={styles.cancelBtn} onClick={() => setEditingCategory(null)}>
                  취소
                </button>
                <button type="submit" style={styles.submitBtn}>
                  저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 상품 추가 모달 */}
      {showAddModal && (
        <div style={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>상품 추가</h3>
            <form onSubmit={handleAddProduct}>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                style={styles.input}
                required
              >
                <option value="">카테고리 선택</option>
                {categories.map(category => (
                  <option key={category.categoryId} value={category.categoryId}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="상품 이름"
                value={formData.productName}
                onChange={(e) => setFormData({...formData, productName: e.target.value})}
                style={styles.input}
                required
              />
              <input
                type="number"
                placeholder="가격"
                value={formData.productPrice}
                onChange={(e) => setFormData({...formData, productPrice: e.target.value})}
                style={styles.input}
                required
              />
              <div style={styles.modalActions}>
                <button type="button" style={styles.cancelBtn} onClick={() => setShowAddModal(false)}>
                  취소
                </button>
                <button type="submit" style={styles.submitBtn}>
                  추가
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 상품 수정 모달 */}
      {editingProduct && (
        <div style={styles.modalOverlay} onClick={() => setEditingProduct(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>상품 수정</h3>
            <form onSubmit={handleEditProduct}>
              <input
                type="text"
                placeholder="상품 이름"
                value={formData.productName}
                onChange={(e) => setFormData({...formData, productName: e.target.value})}
                style={styles.input}
                required
              />
              <input
                type="number"
                placeholder="가격"
                value={formData.productPrice}
                onChange={(e) => setFormData({...formData, productPrice: e.target.value})}
                style={styles.input}
                required
              />
              <div style={styles.modalActions}>
                <button type="button" style={styles.cancelBtn} onClick={() => setEditingProduct(null)}>
                  취소
                </button>
                <button type="submit" style={styles.submitBtn}>
                  저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 재료 추가 모달 */}
      {showAddIngredientModal && (
        <div style={styles.modalOverlay} onClick={() => setShowAddIngredientModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>재료 추가</h3>
            <form onSubmit={handleAddIngredient}>
              <input
                type="text"
                placeholder="재료 이름"
                value={ingredientFormData.ingredientName}
                onChange={(e) => setIngredientFormData({...ingredientFormData, ingredientName: e.target.value})}
                style={styles.input}
                required
              />
              <input
                type="number"
                placeholder="재고량"
                value={ingredientFormData.ingredientStock}
                onChange={(e) => setIngredientFormData({...ingredientFormData, ingredientStock: e.target.value})}
                style={styles.input}
                required
              />
              <input
                type="text"
                placeholder="단위 (예: g, ml, 개)"
                value={ingredientFormData.ingredientUnit}
                onChange={(e) => setIngredientFormData({...ingredientFormData, ingredientUnit: e.target.value})}
                style={styles.input}
                required
              />
              <div style={styles.modalActions}>
                <button type="button" style={styles.cancelBtn} onClick={() => setShowAddIngredientModal(false)}>
                  취소
                </button>
                <button type="submit" style={styles.submitBtn}>
                  추가
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 재료 수정 모달 */}
      {editingIngredient && (
        <div style={styles.modalOverlay} onClick={() => setEditingIngredient(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>재료 수정</h3>
            <form onSubmit={handleEditIngredient}>
              <input
                type="text"
                placeholder="재료 이름"
                value={ingredientFormData.ingredientName}
                onChange={(e) => setIngredientFormData({...ingredientFormData, ingredientName: e.target.value})}
                style={styles.input}
                required
              />
              <input
                type="number"
                placeholder="재고량"
                value={ingredientFormData.ingredientStock}
                onChange={(e) => setIngredientFormData({...ingredientFormData, ingredientStock: e.target.value})}
                style={styles.input}
                required
              />
              <input
                type="text"
                placeholder="단위 (예: g, ml, 개)"
                value={ingredientFormData.ingredientUnit}
                onChange={(e) => setIngredientFormData({...ingredientFormData, ingredientUnit: e.target.value})}
                style={styles.input}
                required
              />
              <div style={styles.modalActions}>
                <button type="button" style={styles.cancelBtn} onClick={() => setEditingIngredient(null)}>
                  취소
                </button>
                <button type="submit" style={styles.submitBtn}>
                  저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 레시피 추가 모달 */}
      {showAddRecipeModal && (
        <div style={styles.modalOverlay} onClick={() => setShowAddRecipeModal(false)}>
          <div style={{...styles.modal, maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto'}} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>레시피 추가</h3>
            <form onSubmit={handleAddRecipe}>
              <select
                value={recipeFormData.productId}
                onChange={(e) => setRecipeFormData({...recipeFormData, productId: e.target.value})}
                style={styles.input}
                required
              >
                <option value="">상품 선택</option>
                {products.map(product => (
                  <option key={product.productId} value={product.productId}>
                    {product.productName}
                  </option>
                ))}
              </select>
              
              <div style={{ marginTop: '16px', marginBottom: '8px', fontWeight: 'bold' }}>재료 목록</div>
              
              {recipeFormData.recipeItems.map((item, index) => (
                <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                  <select
                    value={item.ingredientId}
                    onChange={(e) => updateRecipeItem(index, 'ingredientId', e.target.value)}
                    style={{...styles.input, flex: 2, margin: 0}}
                    required
                  >
                    <option value="">재료 선택</option>
                    {ingredients.map(ingredient => (
                      <option key={ingredient.ingredientId} value={ingredient.ingredientId}>
                        {ingredient.ingredientName}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    placeholder="필요량"
                    value={item.quantity}
                    onChange={(e) => updateRecipeItem(index, 'quantity', e.target.value)}
                    style={{...styles.input, flex: 1, margin: 0}}
                    required
                  />
                  {recipeFormData.recipeItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRecipeItem(index)}
                      style={{...styles.deleteBtn, padding: '8px 12px', minWidth: 'auto'}}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              
              <button
                type="button"
                onClick={addRecipeItem}
                style={{...styles.editBtn, width: '100%', marginBottom: '16px'}}
              >
                + 재료 추가
              </button>

              <div style={styles.modalActions}>
                <button type="button" style={styles.cancelBtn} onClick={() => setShowAddRecipeModal(false)}>
                  취소
                </button>
                <button type="submit" style={styles.submitBtn}>
                  추가
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 레시피 수정 모달 */}
      {editingRecipe && (
        <div style={styles.modalOverlay} onClick={() => setEditingRecipe(null)}>
          <div style={{...styles.modal, maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto'}} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>레시피 수정</h3>
            <form onSubmit={handleEditRecipe}>
              <div style={{ marginBottom: '16px' }}>
                <strong>상품:</strong> {products.find(p => p.productId === editingRecipe)?.productName}
              </div>
              
              <div style={{ marginTop: '16px', marginBottom: '8px', fontWeight: 'bold' }}>재료 목록</div>
              
              {recipeFormData.recipeItems.map((item, index) => (
                <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                  <select
                    value={item.ingredientId}
                    onChange={(e) => updateRecipeItem(index, 'ingredientId', e.target.value)}
                    style={{...styles.input, flex: 2, margin: 0}}
                    required
                  >
                    <option value="">재료 선택</option>
                    {ingredients.map(ingredient => (
                      <option key={ingredient.ingredientId} value={ingredient.ingredientId}>
                        {ingredient.ingredientName}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    placeholder="필요량"
                    value={item.quantity}
                    onChange={(e) => updateRecipeItem(index, 'quantity', e.target.value)}
                    style={{...styles.input, flex: 1, margin: 0}}
                    required
                  />
                  {recipeFormData.recipeItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRecipeItem(index)}
                      style={{...styles.deleteBtn, padding: '8px 12px', minWidth: 'auto'}}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              
              <button
                type="button"
                onClick={addRecipeItem}
                style={{...styles.editBtn, width: '100%', marginBottom: '16px'}}
              >
                + 재료 추가
              </button>

              <div style={styles.modalActions}>
                <button type="button" style={styles.cancelBtn} onClick={() => setEditingRecipe(null)}>
                  취소
                </button>
                <button type="submit" style={styles.submitBtn}>
                  저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// --- CSS 스타일 ---
const styles = {
  container: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    minHeight: '100vh',
    backgroundColor: '#ffffff',
  },
  header: {
    borderBottom: '1px solid #e0e0e0',
    padding: '0 20px',
    backgroundColor: '#ffffff',
  },
  headerInner: {
    maxWidth: '1200px',
    margin: '0 auto',
    height: '70px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#007bff',
    cursor: 'pointer',
    margin: 0,
  },
  authNav: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  userName: {
    fontSize: '15px',
    color: '#333',
    fontWeight: '500',
  },
  loginBtn: {
    padding: '10px 20px',
    border: '1px solid #007bff',
    borderRadius: '6px',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    fontSize: '15px',
    color: '#007bff',
    fontWeight: '500',
    transition: 'all 0.2s',
  },
  logoutBtn: {
    padding: '10px 20px',
    border: '1px solid #dc3545',
    borderRadius: '6px',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    fontSize: '15px',
    color: '#dc3545',
    fontWeight: '500',
    transition: 'all 0.2s',
  },
  signupBtn: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#007bff',
    color: '#ffffff',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600',
    transition: 'all 0.2s',
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  tabContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '30px',
    borderBottom: '2px solid #e0e0e0',
    overflowX: 'auto',
  },
  tab: {
    padding: '12px 24px',
    border: 'none',
    borderBottom: '3px solid transparent',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
    color: '#666',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
  },
  activeTab: {
    color: '#007bff',
    borderBottomColor: '#007bff',
    fontWeight: '600',
  },
  titleSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  },
  welcomeTitle: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#007bff',
    margin: 0,
  },
  posBtn: {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#28a745',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  menuContainer: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  menuHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '2px solid #e0e0e0',
  },
  menuHeaderTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#333',
    margin: 0,
  },
  addMenuBtn: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#007bff',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  menuGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  menuCard: {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '16px',
    backgroundColor: '#fafafa',
    transition: 'all 0.2s',
  },
  menuImage: {
    width: '100%',
    height: '180px',
    backgroundColor: '#e9ecef',
    borderRadius: '6px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '12px',
  },
  menuImagePlaceholder: {
    fontSize: '64px',
  },
  menuInfo: {
    marginBottom: '12px',
  },
  menuName: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 8px 0',
  },
  menuPrice: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#007bff',
    margin: '0 0 8px 0',
  },
  menuDesc: {
    fontSize: '14px',
    color: '#666',
    margin: 0,
  },
  menuActions: {
    display: 'flex',
    gap: '8px',
  },
  editBtn: {
    flex: 1,
    padding: '8px',
    border: '1px solid #007bff',
    borderRadius: '4px',
    backgroundColor: '#ffffff',
    color: '#007bff',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  deleteBtn: {
    flex: 1,
    padding: '8px',
    border: '1px solid #dc3545',
    borderRadius: '4px',
    backgroundColor: '#ffffff',
    color: '#dc3545',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  notLoggedIn: {
    textAlign: 'center',
    padding: '120px 20px',
  },
  welcomeDesc: {
    fontSize: '18px',
    color: '#666',
    marginBottom: '30px',
  },
  primaryBtn: {
    padding: '14px 32px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#007bff',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  emptyMessage: {
    gridColumn: '1 / -1',
    textAlign: 'center',
    padding: '40px',
    color: '#666',
    fontSize: '16px',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '30px',
    width: '90%',
    maxWidth: '500px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
  },
  modalTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '20px',
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '15px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '12px',
    marginBottom: '15px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    minHeight: '80px',
    boxSizing: 'border-box',
    resize: 'vertical',
  },
  modalActions: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end',
  },
  cancelBtn: {
    padding: '10px 20px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    backgroundColor: '#ffffff',
    color: '#666',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  submitBtn: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#007bff',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export default LandingPage;