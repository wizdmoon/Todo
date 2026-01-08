import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import dayjs from 'dayjs';
import './TodoModal.scss';
import { useCategoryStore } from '../../../store/useCategoryStore';
import { useAuthStore } from '../../../store/useAuthStore';
import useTodos from '../../../hooks/useTodos';

function TodoModal({ isOpen, onClose }) {
    const categoryList = useCategoryStore((s) => s.categories);
    const userinfo = useAuthStore((s) => s.user);
    const uidx = userinfo?.data?.idx;
    const today = dayjs().format('YYYY-MM-DD');
    
    //   const values = [todoData.uidx, todoData.cidx, todoData.tname, todoData.tcontent, todoData.date];
    const [formData, setFormData] = useState({
        uidx: uidx,
        tname: '',
        tcontent: '',
        cidx: categoryList[0]?.c_idx || '',
        date: today 
    });
    
    const { createTodo } = useTodos(uidx, null, false);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('최종 등록 데이터:', formData);
        createTodo.mutate(formData, {
            onSuccess: () => {
                onClose(); // 성공하면 모달 닫기
                // 입력 폼 초기화
                setFormData({ uidx: '', tname: '', tcontent: '', cidx: categoryList[0]?.c_idx || '', date: dayjs().format('YYYY-MM-DD') });
            }
        });
    };
    
    if (!isOpen) return null;
  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>새 일정 등록</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <form className="todo-form" onSubmit={handleSubmit}>
            <div className="form-group">
            <label>제목</label>
            <input 
              type="text" 
              name="tname"
              value={formData.title}
              onChange={handleChange}
              placeholder="할 일을 입력하세요" 
              required
            />
          </div>
          <div className="form-group">
            <label>날짜 선택</label>
            <input 
              type="date" 
              name="date"
              value={formData.date}
              onChange={handleChange}
              min={today}
            />
          </div>

          <div className="form-group">
            <label>카테고리</label>
            <select name="categoryIdx" value={formData.categoryIdx} onChange={handleChange}>
              <option value="" disabled>카테고리 선택</option>
              {categoryList.map((cat) => (
                <option key={cat.c_idx} value={cat.c_idx}>{cat.c_name}</option>
              ))}
            </select>
          </div>

          

          <div className="form-group">
            <label>상세 설명</label>
            <textarea 
              name="tcontent"
              value={formData.content}
              onChange={handleChange}
              placeholder="상세 내용을 입력하세요" 
            />
          </div>
          
          <div className="form-actions">
            <button type="button" className="submit-btn outline medium" onClick={onClose}>취소</button>
            <button type="submit" className="submit-btn medium">일정 추가하기</button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

export default TodoModal;