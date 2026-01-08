import React from 'react'
import './TodoPage.scss'
import { useAuthStore } from '../../../store/useAuthStore';
import useTodos from '../../../hooks/useTodos';
import { useTodoStore } from '../../../store/useTodoStore';
import { useCategoryStore } from '../../../store/useCategoryStore';
import { useSearchParams } from 'react-router-dom';

function TodoPage() {
  const [searchParams] = useSearchParams();
  const filter = searchParams.get('filter')
  const userInfo = useAuthStore((s) => s.user);
  
  const uidx = userInfo?.data?.idx

  const categoryList = useCategoryStore((s) => s.categories);
  const todoList = useTodoStore((s) => s.todos);

  const { isLoading, updateTodoState } = useTodos(uidx, filter);

  const handleCheck = (e, item) => {
    e.preventDefault(); 

    const changeState = item.t_state === 'DONE' ? 'TODO' : 'DONE';

    updateTodoState({ 
      tidx: item.t_idx, 
      state: changeState, 
      uidx: uidx //
    });
  };

  return (
    <div className='today-container'>
        <div className="header">
            <h2>
              {filter === 'today' && '오늘의 일정'}
              {filter === 'week' && '이번 주 일정'}
              {filter === 'all' && '전체 일정'}
            </h2>
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
                <div className="todo-item" key={item.t_idx} >
                  <label className="todo-check">
                    <input
                      type="checkbox"
                      checked={item.t_state === 'DONE'} 
                      onChange={(e) => handleCheck(e, item)}
                    />
                    <span className="checkmark"></span>
                  </label>
                  <div className="todo-info">
                    <span className="category-badge">{categoryName}</span>
                    <h4 className={`todo-title ${item.t_state === 'DONE' ? 'done' : ''}`}>
                    {item.t_name}
                    </h4>
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

export default TodoPage