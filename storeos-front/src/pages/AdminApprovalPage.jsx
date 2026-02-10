import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function AdminApprovalPage() {
  const navigate = useNavigate();
  const [pendingManagers, setPendingManagers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingManagers();
  }, []);

  const fetchPendingManagers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/pending/managers');
      setPendingManagers(response.data);
    } catch (error) {
      console.error('Failed to fetch pending managers:', error);
      alert('관리자 승인 목록을 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId, approved) => {
    const action = approved ? '승인' : '거절';
    if (!window.confirm(`정말 ${action}하시겠습니까?`)) return;

    try {
      const response = await api.put(`/admin/approve/manager/${userId}?approved=${approved}`);
      alert(response.data);
      fetchPendingManagers(); // 목록 새로고침
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
          <span style={styles.adminBadge}>관리자</span>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.content}>
          <div style={styles.titleSection}>
            <h2 style={styles.title}>관리자 승인 대기 목록</h2>
            <p style={styles.subtitle}>가게 관리자 가입 신청을 검토하고 승인하세요</p>
          </div>

          {loading ? (
            <div style={styles.loading}>로딩중...</div>
          ) : pendingManagers.length === 0 ? (
            <div style={styles.empty}>
              <p style={styles.emptyText}>승인 대기중인 관리자가 없습니다</p>
            </div>
          ) : (
            <div style={styles.cardContainer}>
              {pendingManagers.map((manager) => (
                <div key={manager.userId} style={styles.card}>
                  <div style={styles.cardHeader}>
                    <div>
                      <h3 style={styles.cardTitle}>{manager.userName}</h3>
                      <p style={styles.cardSubtitle}>@{manager.loginId}</p>
                    </div>
                    <span style={styles.roleBadge}>관리자</span>
                  </div>

                  <div style={styles.cardBody}>
                    <div style={styles.infoSection}>
                      <h4 style={styles.sectionTitle}>가게 정보</h4>
                      <div style={styles.infoGrid}>
                        <div style={styles.infoItem}>
                          <span style={styles.infoLabel}>가게명</span>
                          <span style={styles.infoValue}>{manager.storeName}</span>
                        </div>
                        <div style={styles.infoItem}>
                          <span style={styles.infoLabel}>사업자번호</span>
                          <span style={styles.infoValue}>{manager.businessNumber || 'N/A'}</span>
                        </div>
                        <div style={styles.infoItem}>
                          <span style={styles.infoLabel}>대표자명</span>
                          <span style={styles.infoValue}>{manager.managerName || 'N/A'}</span>
                        </div>
                        <div style={styles.infoItem}>
                          <span style={styles.infoLabel}>가게 코드</span>
                          <span style={styles.infoValue}>{manager.storeCode}</span>
                        </div>
                      </div>
                    </div>

                    {manager.verificationImageUrl && (
                      <div style={styles.imageSection}>
                        <h4 style={styles.sectionTitle}>사업 등록증</h4>
                        <img 
                          src={manager.verificationImageUrl} 
                          alt="사업 등록증" 
                          style={styles.verificationImage}
                        />
                      </div>
                    )}
                  </div>

                  <div style={styles.cardFooter}>
                    <button
                      onClick={() => handleApprove(manager.userId, false)}
                      style={styles.rejectButton}
                    >
                      거절
                    </button>
                    <button
                      onClick={() => handleApprove(manager.userId, true)}
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
    gap: '10px',
  },
  adminBadge: {
    backgroundColor: '#dc3545',
    color: '#ffffff',
    padding: '6px 12px',
    borderRadius: '4px',
    fontSize: '13px',
    fontWeight: '600',
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
    gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))',
    gap: '24px',
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
    backgroundColor: '#007bff',
    color: '#ffffff',
    padding: '4px 10px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
  },
  cardBody: {
    marginBottom: '20px',
  },
  infoSection: {
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '12px',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
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
  imageSection: {
    marginTop: '20px',
  },
  verificationImage: {
    width: '100%',
    maxHeight: '300px',
    objectFit: 'contain',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
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

export default AdminApprovalPage;
