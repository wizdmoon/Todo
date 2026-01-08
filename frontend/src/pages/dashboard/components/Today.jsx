import React from 'react'
import './Today.scss'
import { useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../../store/useAuthStore';
import { useCategoryStore } from '../../../store/useCategoryStore';
import useTodos from '../../../hooks/useTodos';
import { useTodoStore } from '../../../store/useTodoStore';

function Today() {
  const [searchParams] = useSearchParams();
  const filter = searchParams.get('filter')
  const userInfo = useAuthStore((s) => s.user);
  const categoryList = useCategoryStore((c) => c.categories);
  
  const uidx = userInfo?.data?.idx;

  const { isPending } = useTodos(uidx, filter);

  const todoList = useTodoStore((t) => t.todos);



  return (
    <div className='today-container'>
      <div className='header'>
        {filter === 'yesterday' && '어제'}
        {filter === 'today' && '오늘'}
        {filter === 'week' && '이번 주'}
      </div>
      <div className='todolist-section'>
        {todoList.map((item) => {
          return (
            <div className='todo-item'>
              <div className='todo-state'>{item.t_state}</div>
              <div className='todo-info'>
                <div className='todo-title'>{item.t_name}</div>
                <div className='todo'>{item.t_content}</div>
              </div>
              <div className='todo-option'>{item.target_date}</div>
              <p>
                {item.t_idx}
              </p>
            </div>
          )
        })}
      </div>
    </div>
    
  )
}

export default Today