// import React, { useState } from 'react';
// import { createPortal } from 'react-dom';
// import dayjs from 'dayjs';
// import './TodoModal.scss';
// import { useCategoryStore } from '../../../store/useCategoryStore';
// import { useAuthStore } from '../../../store/useAuthStore';
// import useTodos from '../../../hooks/useTodos';
// import { useTodoStore } from '../../../store/useTodoStore';

// function TodoInfoModal({ isOpen, onClose }) {
//     const categoryList = useCategoryStore((s) => s.categories);
//     const userinfo = useAuthStore((s) => s.user);
//     const uidx = userinfo?.data?.idx;
//     const today = dayjs().format('YYYY-MM-DD');
//     const todoList = useTodoStore((s) => s.todos);

//     const selectedTidx = useTodoStore((s) => s.selectedTidx);
//     console.log('selectedTidx: ', selectedTidx);

//     const targetTodo = selectedTidx 
//       ? todoList.find(todo => todo.t_idx === selectedTidx) 
//       : null;

//       console.log('targetTodo: ', targetTodo);

    
//     const [formData, setFormData] = useState({
//         uidx: uidx,
//         tname: targetTodo.t_name,
//         tcontent: targetTodo.t_content,
//         cidx: targetTodo.c_idx,
//         date: dayjs(targetTodo.target_date).format('YYYY-MM-DD')
//     });

//     console.log('formData: ', formData);
    
//     const { updateTodo } = useTodos(uidx, null, false);
    
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({ ...prev, [name]: value }));
//     };
    
//     const handleSubmit = (e) => {
//         e.preventDefault();
//         console.log('최종 등록 데이터:', formData);
//         updateTodo.mutate({tidx: selectedTidx, todoData: formData}, {
//             onSuccess: () => {
//                 onClose(); // 성공하면 모달 닫기
//                 // 입력 폼 초기화
//                 // setFormData({ uidx: '', tname: '', tcontent: '', cidx: categoryList[0]?.c_idx || '', date: dayjs().format('YYYY-MM-DD') });
//             }
//         });
//     };
    
//     if (!isOpen) return null;
//   return createPortal(
//     <div className="modal-overlay" onClick={onClose}>
//       <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//         <div className="modal-header">
//           <h3>일정</h3>
//           <button className="close-btn" onClick={onClose}>&times;</button>
//         </div>
//         <form className="todo-form" onSubmit={handleSubmit}>
//             <div className="form-group">
//             <label>제목</label>
//             <input 
//               type="text" 
//               name="tname"
//               value={formData.tname}
//               onChange={handleChange}
//               placeholder="할 일을 입력하세요" 
//               required
//             />
//           </div>
//           <div className="form-group">
//             <label>날짜</label>
//             <input 
//               type="date" 
//               name="date"
//               value={formData.date}
//               onChange={handleChange}
//               min={today}
//             />
//           </div>

//           <div className="form-group">
//             <label>카테고리</label>
//             <select name="cidx" value={formData.cidx} onChange={handleChange}>
//               <option value="" disabled>카테고리 선택</option>
//               {categoryList.map((cat) => (
//                 <option key={cat.c_idx} value={cat.c_idx}>{cat.c_name}</option>
//               ))}
//             </select>
//           </div>

          

//           <div className="form-group">
//             <label>상세 설명</label>
//             <textarea 
//               name="tcontent"
//               value={formData.tcontent}
//               onChange={handleChange}
//               placeholder="상세 내용을 입력하세요" 
//             />
//           </div>
          
//           <div className="form-actions">
//             <button type="button" className="submit-btn outline medium" onClick={onClose}>취소</button>
//             <button type="submit" className="submit-btn medium">수정</button>
//           </div>
//         </form>
//       </div>
//     </div>,
//     document.body
//   );
// }

// export default TodoInfoModal;

import React, { useState, useEffect } from 'react'; // useEffect 추가
import { createPortal } from 'react-dom';
import dayjs from 'dayjs';
import './TodoModal.scss';
import { useCategoryStore } from '../../../store/useCategoryStore';
import { useAuthStore } from '../../../store/useAuthStore';
import useTodos from '../../../hooks/useTodos';
import { useTodoStore } from '../../../store/useTodoStore';

function TodoInfoModal({ isOpen, onClose }) {
  const categoryList = useCategoryStore((s) => s.categories);
  const userinfo = useAuthStore((s) => s.user);
  const uidx = userinfo?.data?.idx;
  const today = dayjs().format('YYYY-MM-DD');
  const todoList = useTodoStore((s) => s.todos);

  const selectedTidx = useTodoStore((s) => s.selectedTidx);
  
  // 1. targetTodo 찾기 (안전하게)
  const targetTodo = selectedTidx 
    ? todoList.find(todo => todo.t_idx === selectedTidx) 
    : null;

  // 2. [수정됨] useState 초기화 시 안전장치 추가
  // targetTodo가 없을 때를 대비해 함수형으로 작성하고 if문으로 체크합니다.
  const [formData, setFormData] = useState(() => {
    if (targetTodo) {
      return {
        uidx: uidx,
        tname: targetTodo.t_name || '', // 데이터가 혹시 없으면 빈 문자열
        tcontent: targetTodo.t_content || '',
        cidx: targetTodo.c_idx,
        date: targetTodo.target_date 
          ? dayjs(targetTodo.target_date).format('YYYY-MM-DD') 
          : today
      };
    } else {
      // 로딩 중이거나 데이터가 없을 때 기본값 (에러 방지용)
      return {
        uidx: uidx,
        tname: '',
        tcontent: '',
        cidx: '',
        date: today
      };
    }
  });

  // 3. [추가됨] 리스트가 업데이트되면 모달 내용도 최신으로 바뀜 (동기화)
  useEffect(() => {
    if (targetTodo) {
      setFormData({
        uidx: uidx,
        tname: targetTodo.t_name || '',
        tcontent: targetTodo.t_content || '',
        cidx: targetTodo.c_idx,
        date: targetTodo.target_date 
          ? dayjs(targetTodo.target_date).format('YYYY-MM-DD') 
          : today
      });
    }
  }, [targetTodo, uidx, today]); // targetTodo가 바뀔 때마다 실행

  const { updateTodo } = useTodos(uidx, null, false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('최종 등록 데이터:', formData);
    
    updateTodo.mutate({ tidx: selectedTidx, todoData: formData }, {
      onSuccess: () => {
        // onClose(); // 성공하면 모달 닫기
      }
    });
  };
  
  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>일정 수정</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <form className="todo-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>제목</label>
            <input 
              type="text" 
              name="tname"
              value={formData.tname}
              onChange={handleChange}
              placeholder="할 일을 입력하세요" 
              required
            />
          </div>
          <div className="form-group">
            <label>날짜</label>
            <input 
              type="date" 
              name="date"
              value={formData.date}
              onChange={handleChange}
              // 수정일 때는 min={today} 제한을 풀기도 합니다. 필요하면 유지하세요.
              min={today} 
            />
          </div>

          <div className="form-group">
            <label>카테고리</label>
            <select name="cidx" value={formData.cidx} onChange={handleChange}>
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
              value={formData.tcontent}
              onChange={handleChange}
              placeholder="상세 내용을 입력하세요" 
            />
          </div>
          
          <div className="form-actions">
            <button type="button" className="submit-btn outline medium" onClick={onClose}>취소</button>
            <button type="submit" className="submit-btn medium">수정 완료</button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

export default TodoInfoModal;