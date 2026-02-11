import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function LandingPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    productName: '',
    productPrice: ''
  });

  // 페이지 로드시 로그인 상태 확인 및 상품 조회
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      
      // 로그인한 사용자의 가게 상품 조회
      if (userData.storeId) {
        fetchProducts(userData.storeId);
      }
    }
  }, []);

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
    if (!user?.storeId) return;

    try {
      // 먼저 카테고리가 필요합니다 - 임시로 기본 카테고리 사용
      alert('상품 추가 기능은 카테고리 선택 UI가 필요합니다');
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
      setFormData({ productName: '', productPrice: '' });
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
      productPrice: product.productPrice
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

      {/* 메인 콘텐츠 - 메뉴 관리 */}
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
              <h2 style={styles.welcomeTitle}>상품 관리</h2>
              {user.role === 'MANAGER' && (
                <button 
                  style={styles.posBtn}
                  onClick={() => navigate('/pos')}
                >
                  🍽️ POS 화면으로
                </button>
              )}
            </div>
            
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
          </>
        )}
      </main>

      {/* 상품 추가 모달 */}
      {showAddModal && (
        <div style={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>상품 추가</h3>
            <form onSubmit={handleAddProduct}>
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