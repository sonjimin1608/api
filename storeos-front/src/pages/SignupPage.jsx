import React, { useState } from 'react';

function SignupPage() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div style={{ padding: '20px' }}>
      <h1>회원가입</h1>
      <div>
        <input 
          type="text" 
          placeholder="아이디" 
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
      </div>
      <div>
        <input 
          type="password" 
          placeholder="비밀번호" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button onClick={() => alert("가입 요청!")}>가입하기</button>
    </div>
  );
}

export default SignupPage;