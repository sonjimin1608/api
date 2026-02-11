import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rnd } from 'react-rnd';
import api from '../api';

export default function POSPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [tables, setTables] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }

    const userData = JSON.parse(storedUser);
    setUser(userData);

    // storeId로 테이블 목록 조회
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
    try {
      const table = tables.find(t => t.tableId === tableId);
      await api.put(`/tables/${tableId}`, null, {
        params: {
          coordX: d.x,
          coordY: d.y,
          width: table.tableWidth,
          height: table.tableHeight
        }
      });
      
      // 업데이트된 테이블 위치 반영
      setTables(prev => prev.map(t => 
        t.tableId === tableId 
          ? { ...t, coordX: d.x, coordY: d.y }
          : t
      ));
    } catch (error) {
      console.error('테이블 위치 업데이트 실패:', error);
    }
  };

  const handleResizeStop = async (tableId, ref, position) => {
    try {
      await api.put(`/tables/${tableId}`, null, {
        params: {
          coordX: position.x,
          coordY: position.y,
          width: parseInt(ref.style.width),
          height: parseInt(ref.style.height)
        }
      });
      
      // 업데이트된 테이블 크기 및 위치 반영
      setTables(prev => prev.map(t => 
        t.tableId === tableId 
          ? { 
              ...t, 
              coordX: position.x, 
              coordY: position.y,
              tableWidth: parseInt(ref.style.width),
              tableHeight: parseInt(ref.style.height)
            }
          : t
      ));
    } catch (error) {
      console.error('테이블 크기 업데이트 실패:', error);
    }
  };

  const handleAddTable = async () => {
    if (!user?.storeId) return;

    try {
      const response = await api.post(`/tables/store/${user.storeId}`, null, {
        params: {
          coordX: 50,
          coordY: 50,
          width: 100,
          height: 100,
          people: 4
        }
      });
      
      setTables([...tables, response.data]);
      alert('테이블이 추가되었습니다');
    } catch (error) {
      console.error('테이블 추가 실패:', error);
      alert('테이블 추가에 실패했습니다');
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
      overflow: 'hidden'
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
          default={{
            x: table.coordX,
            y: table.coordY,
            width: table.tableWidth,
            height: table.tableHeight
          }}
          bounds="parent"
          onDragStop={(e, d) => handleDragStop(table.tableId, d)}
          onResizeStop={(e, direction, ref, delta, position) => 
            handleResizeStop(table.tableId, ref, position)
          }
          style={{
            backgroundColor: '#007bff',
            border: '2px solid #0056b3',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '16px',
            cursor: 'move',
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
          }}
        >
          <div>테이블 {table.tableId}</div>
          <div style={{ fontSize: '12px', marginTop: '5px' }}>
            {table.tablePeople}인석
          </div>
          <div style={{ 
            fontSize: '11px', 
            marginTop: '5px',
            padding: '2px 8px',
            backgroundColor: 
              table.tableStatus === 'EMPTY' ? '#28a745' : 
              table.tableStatus === 'SEATED' ? '#dc3545' : '#ffc107',
            borderRadius: '3px'
          }}>
            {table.tableStatus === 'EMPTY' ? '빈 테이블' : 
             table.tableStatus === 'SEATED' ? '사용 중' : '예약'}
          </div>
        </Rnd>
      ))}
    </div>
  );
}
