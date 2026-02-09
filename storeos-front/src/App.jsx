import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage'; // 새로 만든 파일
import SignupPage from './pages/SignupPage';   // 기존 회원가입
import StorePage from './pages/StorePage';     // 기존 가게등록

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. 메인 화면 (랜딩 페이지) */}
        <Route path="/" element={<LandingPage />} />

        {/* 2. 회원가입 화면 */}
        <Route path="/signup" element={<SignupPage />} />

        {/* 3. 가게 등록 화면 */}
        <Route path="/store" element={<StorePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;