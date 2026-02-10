import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminDashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 로그인 상태 확인
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      
      // ADMIN 권한 확인
      if (userData.role !== 'ADMIN') {
        alert('관리자만 접근할 수 있습니다');
        navigate('/');
      }
    } else {
      alert('로그인이 필요합니다');
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    alert('로그아웃되었습니다');
    navigate('/');
  };

  return (
    <div style={styles.container}>
      {/* 상단 헤더 */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          {/* 좌측 상단: Store POS */}
          <h1 style={styles.logo} onClick={() => navigate('/admin')}>
            Store POS
          </h1>

          {/* 우측 상단: 사용자 정보 / 로그아웃 */}
          <div style={styles.authNav}>
            {user && (
              <>
                <span style={styles.adminBadge}>관리자</span>
                <span style={styles.userName}>{user.userName}님</span>
                <button 
                  style={styles.logoutBtn} 
                  onClick={handleLogout}
                >
                  로그아웃
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main style={styles.main}>
        <h2 style={styles.welcomeTitle}>Store POS에 오신 것을 환영합니다</h2>
        <p style={styles.welcomeDesc}>
          관리자 페이지에서 가게 관리자 승인을 처리하세요
        </p>
        
        <div style={styles.buttonGroup}>
          <button 
            style={styles.primaryBtn}
            onClick={() => navigate('/admin/approvals')}
          >
            승인 대기 관리자 조회
          </button>
        </div>
      </main>
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
  adminBadge: {
    padding: '6px 12px',
    backgroundColor: '#007bff',
    color: '#ffffff',
    borderRadius: '4px',
    fontSize: '13px',
    fontWeight: '600',
  },
  userName: {
    fontSize: '15px',
    color: '#333',
    fontWeight: '500',
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
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '120px 20px',
    textAlign: 'center',
  },
  welcomeTitle: {
    fontSize: '42px',
    fontWeight: '700',
    color: '#007bff',
    marginBottom: '20px',
  },
  welcomeDesc: {
    fontSize: '18px',
    color: '#666',
    marginBottom: '50px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
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
    transition: 'all 0.2s',
  },
};

export default AdminDashboardPage;
