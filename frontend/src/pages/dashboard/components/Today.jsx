import React from 'react'
import './today.scss'
import { useAuthStore } from '../../../store/useAuthStore';
import dayjs from 'dayjs';
import useTodos from '../../../hooks/useTodos';
import { useTodoStore } from '../../../store/useTodoStore';
// 👇 [필수] import 추가
import { useCategoryStore } from '../../../store/useCategoryStore';

function Today() {
  const userInfo = useAuthStore((s) => s.user);
  
  // 데이터 안전 접근 (?.)
  const uidx = userInfo?.data?.idx || userInfo?.data?.member?.idx; // 혹시 몰라 둘 다 체크

  const categoryList = useCategoryStore((s) => s.categories);
  const todoList = useTodoStore((s) => s.todos);

  const today = dayjs().format('YYYY-MM-DD');
  
  const { isLoading, updateTodoState } = useTodos(uidx, today);

  const handleCheck = (e, item) => {
    // 1. [오타 수정] preventDefaullt -> preventDefault
    // (체크박스 UI가 즉시 바뀌는 걸 막고 서버 응답 후 바꾸고 싶다면 유지, 아니면 삭제해도 됨)
    e.preventDefault(); 

    // 2. 바꿀 상태 계산 ('DONE' <-> 'TODO')
    const nextState = item.t_state === 'DONE' ? 'TODO' : 'DONE';

    // 3. [중요] updateTodoState에는 "객체 하나"로 묶어서 보내야 합니다!
    // useTodos 훅에서 ({ t_idx, t_state, u_idx }) 이렇게 받기로 했으니까요.
    updateTodoState({ 
      tidx: item.t_idx, 
      state: nextState, 
      uidx: uidx // ★ 컴포넌트 상단에서 선언한 uidx 변수 사용
    });
  };

  

  // 로딩 중일 때 보여줄 화면 (선택 사항)
  if (isLoading && todoList.length === 0) {
    return <div className='today-container'>로딩 중...</div>;
  }

  return (
    <div className='today-container'>
        <div className="header">
            <h1>Today</h1>
        </div>
        {todoList.length === 0 ? (
          <div className="empty-state">
            <p>오늘 등록된 할 일이 없습니다.</p>
          </div>
        ) : (
          <div className="todo-list">
            {todoList.map((item) => {
              const category = categoryList.find((c) => c.c_idx === item.c_idx);
              const categoryName = category ? category.c_name : '기타';
              return (
                // <div key={item.t_idx} className="todo-item"> 
                //   <div className="todo-info">
                //     <span className="category-badge">{categoryName}</span>
                //     <h4>{item.t_name}</h4>
                //   </div>
                //   <div className="todo-desc">
                //     <p>{item.t_content}</p>
                //   </div>
                // </div>
                <div className="todo-item" key={item.t_idx} >
  {/* 1. 상태 (왼쪽 체크박스) */}
  <label className="todo-check">
    <input 
      type="checkbox" 
      checked={item.t_state === 'DONE'} 
      onChange={(e) => handleCheck(e, item)}
    /> 
    <span className="checkmark"></span>
  </label>

  {/* 2. 정보 영역 (가운데) */}
  <div className="todo-info">
    {/* 카테고리 뱃지 */}
    <span className="category-badge">{categoryName}</span>
    
    {/* 제목 */}
    <h4 className={`todo-title ${item.t_state === 'DONE' ? 'done' : ''}`}>
      {item.t_name}
    </h4>
    
    {/* 내용 */}
    <p className="todo-content">{item.t_content}</p>
  </div>
</div>
              );
            })}
          </div>
        )}
    </div>
  )
}

export default Today