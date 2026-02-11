import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function LoginPage() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    loginId: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.loginId.trim()) {
      newErrors.loginId = '아이디를 입력해주세요';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setIsLoading(true);
      const response = await api.post('/login', formData);
      
      // 로그인 성공 - localStorage에 저장
      localStorage.setItem('user', JSON.stringify(response.data));
      
      alert(`환영합니다, ${response.data.userName}님!`);
      
      // 역할에 따라 다른 페이지로 이동
      if (response.data.role === 'ADMIN') {
        navigate('/admin'); // 관리자는 admin 대시보드로
      } else {
        navigate('/'); // 매니저와 일반 사용자는 메인 페이지로
      }
    } catch (error) {
      console.error('로그인 실패:', error);
      const errorMessage = typeof error.response?.data === 'string' 
        ? error.response.data 
        : error.response?.data?.message || '로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.';
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.logo} onClick={() => navigate('/')}>
          Store POS
        </h1>
      </header>

      <main style={styles.main}>
        <div style={styles.formContainer}>
          <h2 style={styles.title}>로그인</h2>
          <p style={styles.subtitle}>Store POS에 로그인하세요</p>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>아이디</label>
              <input
                type="text"
                name="loginId"
                value={formData.loginId}
                onChange={handleChange}
                placeholder="아이디를 입력하세요"
                style={errors.loginId ? styles.inputError : styles.input}
                disabled={isLoading}
              />
              {errors.loginId && <p style={styles.errorText}>{errors.loginId}</p>}
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>비밀번호</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="비밀번호를 입력하세요"
                style={errors.password ? styles.inputError : styles.input}
                disabled={isLoading}
              />
              {errors.password && <p style={styles.errorText}>{errors.password}</p>}
            </div>

            <button 
              type="submit" 
              style={isLoading ? styles.submitButtonDisabled : styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </button>

            <p style={styles.signupLink}>
              계정이 없으신가요?{' '}
              <span onClick={() => navigate('/signup')} style={styles.link}>
                회원가입
              </span>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderBottom: '1px solid #e0e0e0',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  logo: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#007bff',
    cursor: 'pointer',
    margin: 0,
    textAlign: 'center',
  },
  main: {
    padding: '40px 20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 100px)',
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '40px',
    maxWidth: '450px',
    width: '100%',
    boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '8px',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: '15px',
    color: '#666',
    marginBottom: '32px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
  },
  input: {
    padding: '12px 16px',
    fontSize: '15px',
    border: '1px solid #d0d0d0',
    borderRadius: '6px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  inputError: {
    padding: '12px 16px',
    fontSize: '15px',
    border: '1px solid #dc3545',
    borderRadius: '6px',
    outline: 'none',
  },
  errorText: {
    fontSize: '13px',
    color: '#dc3545',
    margin: 0,
  },
  submitButton: {
    padding: '14px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'background-color 0.2s',
  },
  submitButtonDisabled: {
    padding: '14px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#6c757d',
    border: 'none',
    borderRadius: '6px',
    cursor: 'not-allowed',
    marginTop: '10px',
  },
  signupLink: {
    textAlign: 'center',
    fontSize: '14px',
    color: '#666',
    marginTop: '10px',
  },
  link: {
    color: '#007bff',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
};

export default LoginPage;
