import React from 'react';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      {/* 상단 헤더 */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          {/* 좌측 상단: Store POS */}
          <h1 style={styles.logo} onClick={() => navigate('/')}>
            Store POS
          </h1>

          {/* 우측 상단: 로그인 / 회원가입 */}
          <div style={styles.authNav}>
            <button 
              style={styles.loginBtn} 
              onClick={() => alert('로그인 기능은 준비중입니다')}
            >
              로그인
            </button>
            <button 
              style={styles.signupBtn} 
              onClick={() => navigate('/signup')}
            >
              회원가입
            </button>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main style={styles.main}>
        <h2 style={styles.welcomeTitle}>Store POS에 오신 것을 환영합니다</h2>
        <p style={styles.welcomeDesc}>
          간편하게 매장을 관리하고 판매를 기록하세요
        </p>
        
        <div style={styles.buttonGroup}>
          <button 
            style={styles.primaryBtn}
            onClick={() => navigate('/store')}
          >
            가게 등록하기
          </button>
          <button 
            style={styles.secondaryBtn}
            onClick={() => alert('대시보드 기능은 준비중입니다')}
          >
            둘러보기
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
    color: '#1a1a1a',
    cursor: 'pointer',
    margin: 0,
  },
  authNav: {
    display: 'flex',
    gap: '12px',
  },
  loginBtn: {
    padding: '10px 20px',
    border: '1px solid #d0d0d0',
    borderRadius: '6px',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    fontSize: '15px',
    color: '#333',
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
    padding: '120px 20px',
    textAlign: 'center',
  },
  welcomeTitle: {
    fontSize: '42px',
    fontWeight: '700',
    color: '#1a1a1a',
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
  secondaryBtn: {
    padding: '14px 32px',
    border: '2px solid #007bff',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    color: '#007bff',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
};

export default LandingPage;