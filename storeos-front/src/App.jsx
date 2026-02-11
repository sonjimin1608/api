import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import StorePage from './pages/StorePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminApprovalPage from './pages/AdminApprovalPage';
import ManagerApprovalPage from './pages/ManagerApprovalPage';
import POSPage from './pages/POSPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. 메인 화면 (랜딩 페이지) */}
        <Route path="/" element={<LandingPage />} />

        {/* 2. 로그인 화면 */}
        <Route path="/login" element={<LoginPage />} />

        {/* 3. 회원가입 화면 */}
        <Route path="/signup" element={<SignupPage />} />

        {/* 4. 가게 등록 화면 */}
        <Route path="/store" element={<StorePage />} />

        {/* 5. 관리자 대시보드 (Admin only) */}
        <Route path="/admin" element={<AdminDashboardPage />} />

        {/* 6. 관리자 승인 화면 (Admin only) */}
        <Route path="/admin/approvals" element={<AdminApprovalPage />} />

        {/* 7. 매니저 직원 승인 화면 (Manager only) */}
        <Route path="/manager/approvals" element={<ManagerApprovalPage />} />

        {/* 8. POS 화면 (Manager only) */}
        <Route path="/pos" element={<POSPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;