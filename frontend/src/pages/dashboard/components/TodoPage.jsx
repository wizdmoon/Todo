import React from 'react'
import './TodoPage.scss'
import { useAuthStore } from '../../../store/useAuthStore';
import useTodos from '../../../hooks/useTodos';
import { useTodoStore } from '../../../store/useTodoStore';
import { useCategoryStore } from '../../../store/useCategoryStore';
import { useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { IoTrashOutline } from "react-icons/io5";

import CalendarView from './CalendarView';

function TodoPage() {
  const [searchParams] = useSearchParams();
  const filter = searchParams.get('filter')
  const userInfo = useAuthStore((s) => s.user);
  
  const uidx = userInfo?.data?.idx

  const categoryList = useCategoryStore((s) => s.categories);
  
  // 1. todos 목록과 openInfoModal 함수를 Store에서 가져옵니다.
  const todoList = useTodoStore((s) => s.todos);
  const openInfoModal = useTodoStore((s) => s.openInfoModal); // ★ 추가됨

  const { isLoading, updateTodoState, deleteTodo } = useTodos(uidx, filter);

  // 2. 체크박스 핸들러 수정
  const handleCheck = (e, item) => {
    e.preventDefault(); 
    e.stopPropagation(); // ★ 추가됨: 체크박스 누를 때 모달 열림 방지

    const changeState = item.t_state === 'DONE' ? 'TODO' : 'DONE';
    updateTodoState({ 
      tidx: item.t_idx, 
      state: changeState, 
      uidx: uidx 
    });
  };

  const handleDelete = (e, tidx) => {
    e.preventDefault();
    e.stopPropagation(); // 삭제 버튼 누를 때 모달 열림 방지

    if (window.confirm("정말로 삭제하시겠습니까?")) {
      deleteTodo.mutate(tidx, {
        onSuccess: () => {
           // 성공 처리
        }
      });
    }
  };

  return (
    <div className='today-container'>
        <div className="header">
            <h2>
              {filter === 'today' && '오늘의 일정'}
              {filter === 'yesterday' && '어제의 일정'}
              {filter === 'tomorrow' && '내일의 일정'}
              {filter === 'week' && '이번 주 일정'}
              {filter === 'all' && '월간 일정'}
            </h2>
        </div>

        {filter === 'all' ? (
           <CalendarView todoList={todoList} />
        ) : (
           <>
             {todoList.length === 0 ? (
                <div className="empty-state">
                  <p>등록된 할 일이 없습니다.</p>
                </div>
             ) : (
                <div className="todo-list">
                  {todoList.map((item) => {
                    const category = categoryList.find((c) => c.c_idx === item.c_idx);
                    const categoryName = category ? category.c_name : '기타';
                    const formattedDate = dayjs(item.target_date).format('YYYY. MM. DD');

                    return (
                      // 3. 카드 전체에 클릭 이벤트 연결 (상세 모달 열기)
                      <div 
                        className="todo-item" 
                        key={item.t_idx} 
                        onClick={() => openInfoModal(item.t_idx)} // ★ 클릭 시 상세 모달 오픈
                      >
                        {/* 왼쪽: 체크박스 */}
                        <label className="todo-check" onClick={(e) => e.stopPropagation()}> 
                          {/* label 클릭 시 버블링 방지를 위해 여기도 stopPropagation 넣어주면 더 안전함 */}
                          <input
                            type="checkbox"
                            checked={item.t_state === 'DONE'} 
                            onChange={(e) => handleCheck(e, item)}
                          />
                          <span className="checkmark"></span>
                        </label>
                        
                        {/* 중간: 내용 */}
                        <div className="todo-info">
                          <div className="todo-meta-top">
                              <span className="category-badge">{categoryName}</span>
                              <span className="todo-date">{formattedDate}</span>
                          </div>

                          <h4 className={`todo-title ${item.t_state === 'DONE' ? 'done' : ''}`}>
                            {item.t_name}
                          </h4>
                          <p className="todo-content">{item.t_content}</p>
                        </div>

                        {/* 오른쪽: 삭제 버튼 */}
                        <div className="todo-actions">
                            <button 
                                className="delete-btn" 
                                onClick={(e) => handleDelete(e, item.t_idx)}
                                title="삭제"
                            >
                                <IoTrashOutline />
                            </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
             )}
           </>
        )}
    </div>
  )
}

export default TodoPage