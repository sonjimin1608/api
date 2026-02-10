import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function SignupPage() {
  const navigate = useNavigate();
  
  // 선택된 역할
  const [selectedRole, setSelectedRole] = useState('STAFF'); // MANAGER or STAFF
  
  // 공통 폼 데이터
  const [formData, setFormData] = useState({
    userName: '',
    loginId: '',
    password: '',
    passwordConfirm: '',
  });

  // 관리자 전용 - 가게 정보
  const [storeInfo, setStoreInfo] = useState({
    storeName: '',
    businessNumber: '',
    managerName: '',
  });

  // 증빙 사진
  const [verificationImage, setVerificationImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // 직원 전용 - 가게 코드
  const [storeCode, setStoreCode] = useState('');

  // 동의 체크박스
  const [agreements, setAgreements] = useState({
    termsOfService: false,
    privacyPolicy: false,
    marketing: false
  });

  // 에러 메시지
  const [errors, setErrors] = useState({});

  // 역할 변경 핸들러
  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setErrors({});
  };

  // 입력값 변경
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // 가게 정보 변경
  const handleStoreInfoChange = (e) => {
    const { name, value } = e.target;
    setStoreInfo(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // 이미지 업로드
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVerificationImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 체크박스 변경
  const handleAgreementChange = (e) => {
    const { name, checked } = e.target;
    setAgreements(prev => ({ ...prev, [name]: checked }));
  };  

  // 전체 동의
  const handleAllAgree = (e) => {
    const checked = e.target.checked;
    setAgreements({
      termsOfService: checked,
      privacyPolicy: checked,
      marketing: checked
    });
  };

  // 유효성 검사
  const validate = () => {
    const newErrors = {};

    if (!formData.userName.trim()) newErrors.userName = '이름을 입력해주세요';
    if (!formData.loginId.trim()) newErrors.loginId = '아이디를 입력해주세요';
    else if (formData.loginId.length < 4) newErrors.loginId = '아이디는 4자 이상이어야 합니다';
    
    if (!formData.password) newErrors.password = '비밀번호를 입력해주세요';
    else if (formData.password.length < 6) newErrors.password = '비밀번호는 6자 이상이어야 합니다';
    
    if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다';
    }

    // 관리자 전용 검증
    if (selectedRole === 'MANAGER') {
      if (!storeInfo.storeName.trim()) newErrors.storeName = '가게 이름을 입력해주세요';
      if (!storeInfo.businessNumber.trim()) newErrors.businessNumber = '사업자 번호를 입력해주세요';
      if (!storeInfo.managerName.trim()) newErrors.managerName = '대표자명을 입력해주세요';
      if (!verificationImage) newErrors.verificationImage = '증빙 사진을 첨부해주세요';
    }

    // 직원 전용 검증
    if (selectedRole === 'STAFF') {
      if (!storeCode.trim()) newErrors.storeCode = '가게 코드를 입력해주세요';
    }

    if (!agreements.termsOfService || !agreements.privacyPolicy) {
      newErrors.agreements = '필수 약관에 동의해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 회원가입 제출
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      let endpoint, response;

      if (selectedRole === 'MANAGER') {
        endpoint = '/signup/manager';
        
        // FormData 생성
        const formDataToSend = new FormData();
        
        // user 데이터를 JSON으로 추가
        formDataToSend.append('user', new Blob([JSON.stringify({
          userName: formData.userName,
          loginId: formData.loginId,
          password: formData.password,
          usersRole: 'MANAGER'
        })], { type: 'application/json' }));
        
        // store 데이터를 JSON으로 추가
        formDataToSend.append('store', new Blob([JSON.stringify({
          storeName: storeInfo.storeName,
          businessNumber: storeInfo.businessNumber,
          managerName: storeInfo.managerName
        })], { type: 'application/json' }));
        
        // 파일 추가
        formDataToSend.append('verificationImage', verificationImage);
        
        response = await api.post(endpoint, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        endpoint = '/signup/staff';
        const requestData = {
          user: {
            userName: formData.userName,
            loginId: formData.loginId,
            password: formData.password,
            usersRole: 'STAFF'
          },
          storeCode: storeCode
        };
        response = await api.post(endpoint, requestData);
      }

      alert(response.data);
      navigate('/');
    } catch (error) {
      console.error('회원가입 실패:', error);
      const errorMessage = typeof error.response?.data === 'string' 
        ? error.response.data 
        : error.response?.data?.message || '회원가입에 실패했습니다';
      alert(errorMessage);
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
          <h2 style={styles.title}>회원가입</h2>
          <p style={styles.subtitle}>Store POS와 함께 시작하세요</p>

          {/* 역할 선택 탭 */}
          <div style={styles.roleSelector}>
            <button
              type="button"
              style={selectedRole === 'STAFF' ? styles.roleButtonActive : styles.roleButton}
              onClick={() => handleRoleChange('STAFF')}
            >
              직원으로 가입
            </button>
            <button
              type="button"
              style={selectedRole === 'MANAGER' ? styles.roleButtonActive : styles.roleButton}
              onClick={() => handleRoleChange('MANAGER')}
            >
              관리자로 가입
            </button>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            
            {/* 공통 입력 필드 */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>이름 *</label>
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                placeholder="홍길동"
                style={errors.userName ? styles.inputError : styles.input}
              />
              {errors.userName && <p style={styles.errorText}>{errors.userName}</p>}
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>아이디 *</label>
              <input
                type="text"
                name="loginId"
                value={formData.loginId}
                onChange={handleChange}
                placeholder="4자 이상 입력"
                style={errors.loginId ? styles.inputError : styles.input}
              />
              {errors.loginId && <p style={styles.errorText}>{errors.loginId}</p>}
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>비밀번호 *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="6자 이상 입력"
                style={errors.password ? styles.inputError : styles.input}
              />
              {errors.password && <p style={styles.errorText}>{errors.password}</p>}
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>비밀번호 확인 *</label>
              <input
                type="password"
                name="passwordConfirm"
                value={formData.passwordConfirm}
                onChange={handleChange}
                placeholder="비밀번호를 다시 입력하세요"
                style={errors.passwordConfirm ? styles.inputError : styles.input}
              />
              {errors.passwordConfirm && <p style={styles.errorText}>{errors.passwordConfirm}</p>}
            </div>

            {/* 관리자 전용 필드 */}
            {selectedRole === 'MANAGER' && (
              <>
                <div style={styles.sectionTitle}>가게 정보</div>
                
                <div style={styles.inputGroup}>
                  <label style={styles.label}>가게 이름 *</label>
                  <input
                    type="text"
                    name="storeName"
                    value={storeInfo.storeName}
                    onChange={handleStoreInfoChange}
                    placeholder="스타벅스 강남점"
                    style={errors.storeName ? styles.inputError : styles.input}
                  />
                  {errors.storeName && <p style={styles.errorText}>{errors.storeName}</p>}
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>사업자 번호 *</label>
                  <input
                    type="text"
                    name="businessNumber"
                    value={storeInfo.businessNumber}
                    onChange={handleStoreInfoChange}
                    placeholder="000-00-00000"
                    style={errors.businessNumber ? styles.inputError : styles.input}
                  />
                  {errors.businessNumber && <p style={styles.errorText}>{errors.businessNumber}</p>}
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>대표자명 *</label>
                  <input
                    type="text"
                    name="managerName"
                    value={storeInfo.managerName}
                    onChange={handleStoreInfoChange}
                    placeholder="홍길동"
                    style={errors.managerName ? styles.inputError : styles.input}
                  />
                  {errors.managerName && <p style={styles.errorText}>{errors.managerName}</p>}
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>사업자등록증 *</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={styles.fileInput}
                  />
                  {imagePreview && (
                    <div style={styles.imagePreviewContainer}>
                      <img src={imagePreview} alt="증빙 사진" style={styles.imagePreview} />
                    </div>
                  )}
                  {errors.verificationImage && <p style={styles.errorText}>{errors.verificationImage}</p>}
                  <p style={styles.helperText}>사업자등록증 또는 기타 증빙 사진을 첨부해주세요</p>
                </div>
              </>
            )}

            {/* 직원 전용 필드 */}
            {selectedRole === 'STAFF' && (
              <div style={styles.inputGroup}>
                <label style={styles.label}>가게 코드 *</label>
                <input
                  type="text"
                  value={storeCode}
                  onChange={(e) => {
                    setStoreCode(e.target.value);
                    if (errors.storeCode) setErrors(prev => ({ ...prev, storeCode: '' }));
                  }}
                  placeholder="ST12345"
                  style={errors.storeCode ? styles.inputError : styles.input}
                />
                {errors.storeCode && <p style={styles.errorText}>{errors.storeCode}</p>}
                <p style={styles.helperText}>관리자에게 받은 가게 코드를 입력하세요</p>
              </div>
            )}

            {/* 약관 동의 */}
            <div style={styles.agreementSection}>
              <div style={styles.agreementItem}>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={agreements.termsOfService && agreements.privacyPolicy && agreements.marketing}
                    onChange={handleAllAgree}
                    style={styles.checkbox}
                  />
                  <span style={styles.checkboxText}>전체 동의</span>
                </label>
              </div>
              
              <div style={styles.divider}></div>

              <div style={styles.agreementItem}>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="termsOfService"
                    checked={agreements.termsOfService}
                    onChange={handleAgreementChange}
                    style={styles.checkbox}
                  />
                  <span style={styles.checkboxText}>[필수] 이용약관 동의</span>
                </label>
              </div>

              <div style={styles.agreementItem}>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="privacyPolicy"
                    checked={agreements.privacyPolicy}
                    onChange={handleAgreementChange}
                    style={styles.checkbox}
                  />
                  <span style={styles.checkboxText}>[필수] 개인정보 처리방침 동의</span>
                </label>
              </div>

              <div style={styles.agreementItem}>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="marketing"
                    checked={agreements.marketing}
                    onChange={handleAgreementChange}
                    style={styles.checkbox}
                  />
                  <span style={styles.checkboxText}>[선택] 마케팅 정보 수신 동의</span>
                </label>
              </div>

              {errors.agreements && <p style={styles.errorText}>{errors.agreements}</p>}
            </div>

            <button type="submit" style={styles.submitButton}>
              가입하기
            </button>

            <p style={styles.loginLink}>
              이미 계정이 있으신가요?{' '}
              <span onClick={() => navigate('/login')} style={styles.link}>
                로그인
              </span>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}

// 스타일
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
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '40px',
    maxWidth: '600px',
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
    marginBottom: '24px',
    textAlign: 'center',
  },
  roleSelector: {
    display: 'flex',
    gap: '10px',
    marginBottom: '30px',
  },
  roleButton: {
    flex: 1,
    padding: '12px',
    fontSize: '15px',
    fontWeight: '500',
    color: '#666',
    backgroundColor: '#f8f9fa',
    border: '1px solid #e0e0e0',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  roleButtonActive: {
    flex: 1,
    padding: '12px',
    fontSize: '15px',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#007bff',
    border: '1px solid #007bff',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#007bff',
    marginTop: '10px',
    marginBottom: '-10px',
    paddingBottom: '10px',
    borderBottom: '2px solid #007bff',
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
  fileInput: {
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #d0d0d0',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  imagePreviewContainer: {
    marginTop: '10px',
    textAlign: 'center',
  },
  imagePreview: {
    maxWidth: '100%',
    maxHeight: '200px',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
  },
  helperText: {
    fontSize: '12px',
    color: '#999',
    margin: 0,
  },
  errorText: {
    fontSize: '13px',
    color: '#dc3545',
    margin: 0,
  },
  agreementSection: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    marginTop: '10px',
  },
  agreementItem: {
    marginBottom: '12px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    gap: '10px',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  checkboxText: {
    fontSize: '14px',
    color: '#333',
  },
  divider: {
    height: '1px',
    backgroundColor: '#e0e0e0',
    margin: '12px 0',
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
  loginLink: {
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

export default SignupPage;
