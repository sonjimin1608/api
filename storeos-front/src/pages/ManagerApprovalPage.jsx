import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function ManagerApprovalPage() {
  const navigate = useNavigate();
  const [pendingStaff, setPendingStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [storeCode, setStoreCode] = useState(''); // 실제로는 로그인 정보에서 가져와야 함

  useEffect(() => {
    // 실제로는 로그인한 관리자의 storeCode를 가져와야 함
    // 여기서는 임시로 prompt로 받음
    const code = prompt('가게 코드를 입력하세요 (예: ST12345)');
    if (!code) {
      alert('가게 코드가 필요합니다');
      navigate('/');
      return;
    }
    setStoreCode(code);
    fetchPendingStaff(code);
  }, []);

  const fetchPendingStaff = async (code) => {
    try {
      setLoading(true);
      const response = await api.get(`/manager/pending/staff/${code}`);
      setPendingStaff(response.data);
    } catch (error) {
      console.error('Failed to fetch pending staff:', error);
      alert('직원 승인 목록을 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId, approved) => {
    const action = approved ? '승인' : '거절';
    if (!window.confirm(`정말 ${action}하시겠습니까?`)) return;

    try {
      const response = await api.put(`/manager/approve/staff/${userId}?approved=${approved}`);
      alert(response.data);
      fetchPendingStaff(storeCode); // 목록 새로고침
    } catch (error) {
      console.error('Approval failed:', error);
      alert(error.response?.data || `${action}에 실패했습니다`);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.logo} onClick={() => navigate('/')}>
          Store POS
        </h1>
        <div style={styles.headerRight}>
          <span style={styles.managerBadge}>관리자</span>
          <span style={styles.storeCode}>가게: {storeCode}</span>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.content}>
          <div style={styles.titleSection}>
            <h2 style={styles.title}>직원 승인 대기 목록</h2>
            <p style={styles.subtitle}>우리 가게에 가입 신청한 직원들을 검토하세요</p>
          </div>

          {loading ? (
            <div style={styles.loading}>로딩중...</div>
          ) : pendingStaff.length === 0 ? (
            <div style={styles.empty}>
              <p style={styles.emptyText}>승인 대기중인 직원이 없습니다</p>
            </div>
          ) : (
            <div style={styles.cardContainer}>
              {pendingStaff.map((staff) => (
                <div key={staff.userId} style={styles.card}>
                  <div style={styles.cardHeader}>
                    <div>
                      <h3 style={styles.cardTitle}>{staff.userName}</h3>
                      <p style={styles.cardSubtitle}>@{staff.loginId}</p>
                    </div>
                    <span style={styles.roleBadge}>직원</span>
                  </div>

                  <div style={styles.cardBody}>
                    <div style={styles.infoGrid}>
                      <div style={styles.infoItem}>
                        <span style={styles.infoLabel}>신청 가게</span>
                        <span style={styles.infoValue}>{staff.storeName}</span>
                      </div>
                      <div style={styles.infoItem}>
                        <span style={styles.infoLabel}>가게 코드</span>
                        <span style={styles.infoValue}>{staff.storeCode}</span>
                      </div>
                      <div style={styles.infoItem}>
                        <span style={styles.infoLabel}>신청일</span>
                        <span style={styles.infoValue}>
                          {staff.createdDate ? new Date(staff.createdDate).toLocaleDateString('ko-KR') : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={styles.cardFooter}>
                    <button
                      onClick={() => handleApprove(staff.userId, false)}
                      style={styles.rejectButton}
                    >
                      거절
                    </button>
                    <button
                      onClick={() => handleApprove(staff.userId, true)}
                      style={styles.approveButton}
                    >
                      승인
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
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
    padding: '20px 40px',
    borderBottom: '1px solid #e0e0e0',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#007bff',
    cursor: 'pointer',
    margin: 0,
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  managerBadge: {
    backgroundColor: '#007bff',
    color: '#ffffff',
    padding: '6px 12px',
    borderRadius: '4px',
    fontSize: '13px',
    fontWeight: '600',
  },
  storeCode: {
    fontSize: '14px',
    color: '#666',
    fontWeight: '500',
  },
  main: {
    padding: '40px 20px',
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  titleSection: {
    marginBottom: '30px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '15px',
    color: '#666',
  },
  loading: {
    textAlign: 'center',
    padding: '60px 20px',
    fontSize: '16px',
    color: '#666',
  },
  empty: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '60px 20px',
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  emptyText: {
    fontSize: '16px',
    color: '#999',
  },
  cardContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    transition: 'box-shadow 0.2s',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: '1px solid #e0e0e0',
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1a1a1a',
    margin: '0 0 4px 0',
  },
  cardSubtitle: {
    fontSize: '14px',
    color: '#666',
    margin: 0,
  },
  roleBadge: {
    backgroundColor: '#28a745',
    color: '#ffffff',
    padding: '4px 10px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
  },
  cardBody: {
    marginBottom: '20px',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '12px',
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  infoLabel: {
    fontSize: '12px',
    color: '#999',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: '14px',
    color: '#333',
    fontWeight: '600',
  },
  cardFooter: {
    display: 'flex',
    gap: '12px',
    paddingTop: '16px',
    borderTop: '1px solid #e0e0e0',
  },
  rejectButton: {
    flex: 1,
    padding: '12px',
    fontSize: '15px',
    fontWeight: '600',
    color: '#dc3545',
    backgroundColor: '#ffffff',
    border: '1px solid #dc3545',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  approveButton: {
    flex: 1,
    padding: '12px',
    fontSize: '15px',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#28a745',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
};

export default ManagerApprovalPage;
