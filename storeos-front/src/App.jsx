import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SignupPage from './pages/SignupPage';
import StorePage from './pages/StorePage';
import AdminApprovalPage from './pages/AdminApprovalPage';
import ManagerApprovalPage from './pages/ManagerApprovalPage';

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

        {/* 4. 관리자 승인 화면 (Admin only) */}
        <Route path="/admin/approvals" element={<AdminApprovalPage />} />

        {/* 5. 매니저 직원 승인 화면 (Manager only) */}
        <Route path="/manager/approvals" element={<ManagerApprovalPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;