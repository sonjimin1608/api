import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rnd } from 'react-rnd';
import api from '../api';

export default function POSPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [editForm, setEditForm] = useState({
    tableNumber: 0,
    coordX: 0,
    coordY: 0,
    width: 0,
    height: 0,
    people: 0
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }

    const userData = JSON.parse(storedUser);
    setUser(userData);

    if (userData.storeId) {
      fetchTables(userData.storeId);
    }
  }, [navigate]);

  const fetchTables = async (storeId) => {
    try {
      const response = await api.get(`/tables/store/${storeId}`);
      setTables(response.data);
    } catch (error) {
      console.error('테이블 조회 실패:', error);
    }
  };

  const handleDragStop = async (tableId, d) => {
    const table = tables.find(t => t.tableId === tableId);
    
    // 즉시 로컬 state 업데이트 (깜빡임 방지)
    setTables(prev => prev.map(t => 
      t.tableId === tableId 
        ? { ...t, coordX: d.x, coordY: d.y }
        : t
    ));

    if (selectedTable?.tableId === tableId) {
      setEditForm(prev => ({ 
        ...prev, 
        coordX: d.x, 
        coordY: d.y 
      }));
    }

    // 백그라운드에서 서버 업데이트
    try {
      await api.put(`/tables/${tableId}`, {
        coordX: d.x,
        coordY: d.y,
        width: table.tableWidth,
        height: table.tableHeight
      });
    } catch (error) {
      console.error('테이블 위치 업데이트 실패:', error);
      alert('위치 업데이트 실패: ' + error.message);
      // 실패 시 서버 데이터로 롤백
      fetchTables(user.storeId);
    }
  };

  const handleResizeStop = async (tableId, ref, position) => {
    // offsetWidth/Height 사용 (더 정확함)
    const width = ref.offsetWidth;
    const height = ref.offsetHeight;

    // 즉시 로컬 state 업데이트 (깜빡임 방지)
    setTables(prev => prev.map(t => 
      t.tableId === tableId 
        ? { 
            ...t, 
            coordX: position.x, 
            coordY: position.y,
            tableWidth: width,
            tableHeight: height
          }
        : t
    ));

    if (selectedTable?.tableId === tableId) {
      setEditForm(prev => ({
        ...prev,
        coordX: position.x,
        coordY: position.y,
        width: width,
        height: height
      }));
    }

    // 백그라운드에서 서버 업데이트
    try {
      await api.put(`/tables/${tableId}`, {
        coordX: position.x,
        coordY: position.y,
        width: width,
        height: height
      });
    } catch (error) {
      console.error('테이블 크기 업데이트 실패:', error);
      alert('크기 업데이트 실패: ' + error.message);
      // 실패 시 서버 데이터로 롤백
      fetchTables(user.storeId);
    }
  };

  const handleAddTable = async () => {
    if (!user?.storeId) {
      alert('로그인 정보가 없습니다. 다시 로그인해주세요.');
      return;
    }

    try {
      console.log('테이블 추가 요청:', {
        storeId: user.storeId,
        data: { coordX: 100, coordY: 150, width: 120, height: 100 }
      });

      const response = await api.post(`/tables/store/${user.storeId}`, {
        coordX: 100,
        coordY: 150,
        width: 120,
        height: 100
      });
      
      console.log('테이블 추가 성공:', response.data);
      setTables([...tables, response.data]);
      alert('테이블이 추가되었습니다');
    } catch (error) {
      console.error('테이블 추가 실패 전체 에러:', error);
      console.error('에러 응답:', error.response?.data);
      console.error('에러 상태:', error.response?.status);
      alert('테이블 추가 실패: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteTable = async (tableId) => {
    if (!confirm('정말 이 테이블을 삭제하시겠습니까?')) return;

    try {
      await api.delete(`/tables/${tableId}`);
      setTables(tables.filter(t => t.tableId !== tableId));
      if (selectedTable?.tableId === tableId) {
        setSelectedTable(null);
      }
      alert('테이블이 삭제되었습니다');
    } catch (error) {
      console.error('테이블 삭제 실패:', error);
      alert('테이블 삭제 실패: ' + error.message);
    }
  };

  const handleSelectTable = (table) => {
    setSelectedTable(table);
    setEditForm({
      tableNumber: table.tableNumber,
      coordX: table.coordX,
      coordY: table.coordY,
      width: table.tableWidth,
      height: table.tableHeight,
      people: table.tablePeople
    });
  };

  const handleUpdateTable = async (e) => {
    e.preventDefault();
    if (!selectedTable) return;

    try {
      // DTO 필드명으로 전송: tableNumber, coordX, coordY, width, height, people
      await api.put(`/tables/${selectedTable.tableId}/details`, {
        tableNumber: editForm.tableNumber,
        coordX: editForm.coordX,
        coordY: editForm.coordY,
        width: editForm.width,
        height: editForm.height,
        people: editForm.people
      });

      // 상태 업데이트 (Entity 필드명 사용)
      const updatedTable = {
        ...selectedTable,
        tableNumber: editForm.tableNumber,
        coordX: editForm.coordX,
        coordY: editForm.coordY,
        tableWidth: editForm.width,
        tableHeight: editForm.height,
        tablePeople: editForm.people
      };

      setTables(prev => prev.map(t =>
        t.tableId === selectedTable.tableId ? updatedTable : t
      ));
      
      setSelectedTable(updatedTable);
      alert('테이블 정보가 업데이트되었습니다');
    } catch (error) {
      console.error('테이블 업데이트 실패:', error);
      alert('테이블 업데이트 실패: ' + error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) return <div>로딩 중...</div>;

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: '#8B4513',
      backgroundImage: `
        repeating-linear-gradient(
          90deg,
          transparent,
          transparent 10px,
          rgba(139, 69, 19, 0.3) 10px,
          rgba(139, 69, 19, 0.3) 20px
        ),
        repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(139, 69, 19, 0.3) 2px,
          rgba(139, 69, 19, 0.3) 4px
        )
      `,
      position: 'relative',
      overflow: 'hidden',
      display: 'flex'
    }}>
      {/* 좌측: POS 화면 */}
      <div style={{ 
        flex: 1, 
        position: 'relative',
        minWidth: 0,
        minHeight: 0
      }}>
        {/* 상단 헤더 */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '15px 30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          zIndex: 1000
        }}>
          <h2 style={{ margin: 0, color: '#333' }}>
            {user.userName}님의 POS
          </h2>
          <div>
            <button
              onClick={() => navigate('/')}
              style={{
                padding: '10px 20px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                marginRight: '10px',
                fontSize: '14px'
              }}
            >
              상품 관리
            </button>
            <button
              onClick={handleAddTable}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                marginRight: '10px',
                fontSize: '14px'
              }}
            >
              테이블 추가
            </button>
            <button
              onClick={handleLogout}
              style={{
                padding: '10px 20px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              로그아웃
            </button>
          </div>
        </div>

        {/* 드래그 가능한 테이블들 */}
        {tables.map((table) => (
          <Rnd
            key={table.tableId}
            position={{ x: table.coordX, y: table.coordY }}
            size={{ width: table.tableWidth, height: table.tableHeight }}
            onDragStop={(e, d) => handleDragStop(table.tableId, d)}
            onResizeStop={(e, direction, ref, delta, position) => 
              handleResizeStop(table.tableId, ref, position)
            }
            onClick={() => handleSelectTable(table)}
            enableResizing={{
              top: true,
              right: true,
              bottom: true,
              left: true,
              topRight: true,
              bottomRight: true,
              bottomLeft: true,
              topLeft: true,
            }}
            style={{
              backgroundColor: selectedTable?.tableId === table.tableId ? '#0056b3' : '#007bff',
              border: '2px solid #0056b3',
              borderRadius: '8px',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '16px',
              cursor: 'move',
              boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
              position: 'absolute',
              zIndex: selectedTable?.tableId === table.tableId ? 100 : 1
            }}
          >
            {/* 좌측 상단: 테이블 번호 */}
            <div style={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              {table.tableNumber}
            </div>
            
            {/* 우측 상단: 상태 */}
            <div style={{ 
              position: 'absolute',
              top: '8px',
              right: '8px',
              fontSize: '11px',
              padding: '3px 8px',
              backgroundColor: 
                table.tableStatus === 'EMPTY' ? '#28a745' : 
                table.tableStatus === 'SEATED' ? '#dc3545' : '#ffc107',
              borderRadius: '3px',
              fontWeight: 'bold'
            }}>
              {table.tableStatus === 'EMPTY' ? '비어있음' : 
               table.tableStatus === 'SEATED' ? '사용중' : '예약'}
            </div>

            {/* 중앙: 인원 정보 */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '12px'
            }}>
              {table.tablePeople}인석
            </div>
          </Rnd>
        ))}
      </div>

      {/* 우측: 테이블 관리 패널 */}
      <div style={{
        width: '350px',
        backgroundColor: '#ffffff',
        boxShadow: '-2px 0 5px rgba(0,0,0,0.1)',
        overflowY: 'auto',
        padding: '20px'
}}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3 style={{ margin: 0, color: '#333' }}>테이블 관리</h3>
          {selectedTable && (
            <button
              onClick={() => setSelectedTable(null)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                color: '#666',
                padding: '0',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="닫기"
            >
              ×
            </button>
          )}
        </div>
        
        {selectedTable ? (
          <div>
            <div style={{
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#007bff' }}>
                테이블 {selectedTable.tableNumber}
              </h4>
            </div>

            <form onSubmit={handleUpdateTable}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>
                  테이블 번호
                </label>
                <input
                  type="number"
                  value={editForm.tableNumber}
                  onChange={(e) => setEditForm({ ...editForm, tableNumber: parseInt(e.target.value) })}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>
                  X 좌표
                </label>
                <input
                  type="number"
                  value={editForm.coordX}
                  onChange={(e) => setEditForm({ ...editForm, coordX: parseInt(e.target.value) })}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>
                  Y 좌표
                </label>
                <input
                  type="number"
                  value={editForm.coordY}
                  onChange={(e) => setEditForm({ ...editForm, coordY: parseInt(e.target.value) })}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>
                  너비
                </label>
                <input
                  type="number"
                  value={editForm.width}
                  onChange={(e) => setEditForm({ ...editForm, width: parseInt(e.target.value) })}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>
                  높이
                </label>
                <input
                  type="number"
                  value={editForm.height}
                  onChange={(e) => setEditForm({ ...editForm, height: parseInt(e.target.value) })}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>
                  인원
                </label>
                <input
                  type="number"
                  value={editForm.people}
                  onChange={(e) => setEditForm({ ...editForm, people: parseInt(e.target.value) })}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  marginBottom: '10px'
                }}
              >
                변경사항 저장
              </button>

              <button
                type="button"
                onClick={() => handleDeleteTable(selectedTable.tableId)}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                테이블 삭제
              </button>
            </form>
          </div>
        ) : (
          <p style={{ color: '#666', fontSize: '14px', textAlign: 'center', marginTop: '40px' }}>
            테이블을 선택하면<br />상세 정보를 볼 수 있습니다
          </p>
        )}
      </div>
    </div>
  );
}
