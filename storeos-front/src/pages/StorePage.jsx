import { useState } from 'react';
import api from '../api';
import '../App.css'; // 기본 스타일

function App() {
  // 1. 입력받을 데이터 상태 관리
  const [formData, setFormData] = useState({
    storeName: '',
    businessNumber: '',
    managerName: ''
  });

  // 2. 입력값이 바뀔 때마다 상태 업데이트
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 3. '등록하기' 버튼 눌렀을 때 백엔드로 전송
  const handleSubmit = async (e) => {
    e.preventDefault(); // 새로고침 방지
    try {
      // 백엔드: @PostMapping("/stores")
      const response = await api.post('/stores', formData);
      alert('가게 등록 성공! ID: ' + response.data);
    } catch (error) {
      console.error(error);
      alert('등록 실패 ㅠㅠ 백엔드 로그를 확인하세요.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>🏠 우리 가게 등록하기</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>가게 이름: </label>
          <input 
            name="storeName" 
            value={formData.storeName} 
            onChange={handleChange} 
            placeholder="예: 스타벅스 강남점" 
          />
        </div>
        <br />
        <div>
          <label>사업자 번호: </label>
          <input 
            name="businessNumber" 
            value={formData.businessNumber} 
            onChange={handleChange} 
            placeholder="000-00-00000" 
          />
        </div>
        <br />
        <div>
          <label>사장님 성함: </label>
          <input 
            name="managerName" 
            value={formData.managerName} 
            onChange={handleChange} 
            placeholder="홍길동" 
          />
        </div>
        <br />
        <button type="submit">등록하기</button>
      </form>
    </div>
  );
}

export default App;