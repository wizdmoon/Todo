import React from 'react'
import './Today.scss'
import { useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../../store/useAuthStore';
import { useCategoryStore } from '../../../store/useCategoryStore';
import useTodos from '../../../hooks/useTodos';
import { useTodoStore } from '../../../store/useTodoStore';
import dayjs from 'dayjs';

function Today() {
  const [searchParams] = useSearchParams();
  const filter = searchParams.get('filter')
  const userInfo = useAuthStore((s) => s.user);
  const categoryList = useCategoryStore((c) => c.categories);
  
  const openInfoModal = useTodoStore((s) => s.openInfoModal);

  const uidx = userInfo?.data?.idx;

  const { isPending, deleteTodo } = useTodos(uidx, filter);

  const todoList = useTodoStore((t) => t.todos);

  const handleDelete = (e, tidx) => {
    e.preventDefault();

    if (window.confirm("정말로 삭제하시겠습니까?")) {
      deleteTodo.mutate(tidx, {
        onSuccess: () => {
          // alert('일정이 삭제되었습니다!');
        }
      });
    }
  };

  return (
    <div className='today-container'>
      <div className='header'>
        {filter === 'yesterday' && '어제'}
        {filter === 'today' && '오늘'}
        {filter === 'tomorrow' && '내일'}
        {filter === 'week' && '이번 주'}
      </div>
      <div className='todolist-section'>
        {todoList.map((item) => {
          return (
            <div className='todo-item' onClick={() => openInfoModal(item.t_idx)}>
              <div className='todo-state'>
                {item.t_state}
              </div>
              <div className='todo-info'>
                <div className='todo-title'>{item.t_name}</div>
                <div className='todo'>{item.t_content}</div>
              </div>
              <div className='todo-option'>
                {dayjs(item.target_date).format('YYYY-MM-DD')}
              </div>
              <div><button className="close-btn" onClick={(e) => handleDelete(e, item.t_idx)}>&times;</button></div>
            </div>
          )
        })}
      </div>
    </div>
    
  )
}

export default Today