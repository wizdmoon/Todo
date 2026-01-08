import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import dayjs from 'dayjs';
import './CategoryModal.scss';
import { useCategoryStore } from '../../../store/useCategoryStore';
import { useAuthStore } from '../../../store/useAuthStore';
import useTodos from '../../../hooks/useTodos';
import useCategories from '../../../hooks/useCategories';

function CategoryModal({ isOpen, onClose }) {
    const categoryList = useCategoryStore((s) => s.categories);
    const userinfo = useAuthStore((s) => s.user);
    const uidx = userinfo?.data?.idx;
    
    // const values = [categoryData.uidx, categoryData.cname];
    const [formData, setFormData] = useState({
        uidx: uidx,
        cname: ''
    });
    
    // const { createTodo } = useTodos(uidx, null, false);
    // const { createCategory} = useCategories(uidx);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('최종 등록 데이터:', formData);
        // createCategory.mutate(formData, {
        //     onSuccess: () => {
        //         onClose(); // 성공하면 모달 닫기
        //         // 입력 폼 초기화
        //         setFormData({ cname: ''});
        //     }
        // });
    };
    
    if (!isOpen) return null;
  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>카테고리 관리</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <form className="category-form" onSubmit={handleSubmit}>
            <div className="form-group">
                    <input 
                        type="text" 
                        name="cname"
                        value={formData.cname}
                        onChange={handleChange}
                        placeholder="카테고리를 입력하세요" 
                        required
                    />
                    <button type="submit" className="submit-btn medium">추가</button>
            </div>
            <div className='categorylist-section'>
                {categoryList.map((item) => {
                    return(
                        <div className='category-item'>
                            <p>{item.c_name}</p>
                        </div>
                    )
                })}
            </div>
          
          <div className="form-actions">
            <button type="button" className="submit-btn outline medium" onClick={onClose}>닫기</button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

export default CategoryModal;