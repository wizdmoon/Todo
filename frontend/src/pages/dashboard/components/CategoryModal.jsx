import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import './CategoryModal.scss';
import { useCategoryStore } from '../../../store/useCategoryStore';
import { useAuthStore } from '../../../store/useAuthStore';
import useCategories from '../../../hooks/useCategories';

// 아이콘 사용을 위해 추가 (설치 안되어 있다면 텍스트로 대체 가능)
import { IoPencil, IoCheckmark, IoClose } from "react-icons/io5"; 

function CategoryModal({ isOpen, onClose }) {
    const categoryList = useCategoryStore((s) => s.categories);
    const userinfo = useAuthStore((s) => s.user);
    const uidx = userinfo?.data?.idx;
    
    // --- [1] 기존 등록용 State ---
    const [formData, setFormData] = useState({
        uidx: uidx,
        cname: ''
    });

    // --- [2] 새로 추가된 수정용 State ---
    const [editingId, setEditingId] = useState(null); // 현재 수정 중인 카테고리 ID
    const [editText, setEditText] = useState('');     // 수정 중인 텍스트

    // Hook에서 updateCategory 가져오기 (useCategories에 구현되어 있어야 함)
    const { createCategory, deleteCategory, updateCategory } = useCategories(uidx);

    // --- [기존] 입력 핸들러 ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    
    // --- [기존] 등록 핸들러 ---
    const handleSubmit = (e) => {
        e.preventDefault();
        createCategory.mutate(formData, {
            onSuccess: () => {
                setFormData({ uidx: uidx, cname: ''});
            }
        });
    };

    // --- [기존] 삭제 핸들러 ---
    const handleDelete = (e, cidx) => {
        e.preventDefault();
        if (window.confirm("정말로 삭제하시겠습니까?")) {
            deleteCategory.mutate(cidx);
        }
    };

    // --- [신규] 수정 모드 시작 핸들러 ---
    const handleStartEdit = (item) => {
        setEditingId(item.c_idx); // 해당 아이템을 수정 모드로 변경
        setEditText(item.c_name); // 기존 이름을 input에 세팅
    };

    // --- [신규] 수정 취소 핸들러 ---
    const handleCancelEdit = () => {
        setEditingId(null);
        setEditText('');
    };

    // --- [신규] 수정 저장 핸들러 ---
    const handleSaveEdit = (cidx) => {
        if (!editText.trim()) return alert("카테고리 이름을 입력해주세요.");

        // updateCategory Mutation 실행 (Hook 구현에 따라 인자 확인 필요)
        updateCategory.mutate({ 
            cidx: cidx, 
            cname: editText,
            uidx: uidx
        }, {
            onSuccess: () => {
                setEditingId(null); // 성공 시 수정 모드 종료
            }
        });
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>카테고리 관리</h3>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                {/* 등록 폼 */}
                <form className="category-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input 
                            type="text" 
                            name="cname"
                            value={formData.cname}
                            onChange={handleChange}
                            placeholder="새 카테고리 추가" 
                            required
                        />
                        <button type="submit" className="submit-btn medium">추가</button>
                    </div>
                </form>

                {/* 리스트 영역 */}
                <div className='categorylist-section'>
                    {categoryList.map((item) => {
                        // 현재 아이템이 수정 중인지 확인
                        const isEditing = editingId === item.c_idx;

                        return (
                            <div className='category-item' key={item.c_idx}>
                                {isEditing ? (
                                    // [수정 모드 UI] Input + 저장/취소 버튼
                                    <>
                                        <input 
                                            type="text" 
                                            className="edit-input"
                                            value={editText}
                                            onChange={(e) => setEditText(e.target.value)}
                                            autoFocus
                                        />
                                        <div className="btn-group">
                                            <button type="button" className="icon-btn save" onClick={() => handleSaveEdit(item.c_idx)}>
                                                <IoCheckmark />
                                            </button>
                                            <button type="button" className="icon-btn cancel" onClick={handleCancelEdit}>
                                                <IoClose />
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    // [일반 모드 UI] 텍스트 + 수정/삭제 버튼
                                    <>
                                        <p>{item.c_name}</p>
                                        <div className="btn-group">
                                            <button type="button" className="icon-btn edit" onClick={() => handleStartEdit(item)}>
                                                <IoPencil />
                                            </button>
                                            <button type="button" className="icon-btn delete" onClick={(e) => handleDelete(e, item.c_idx)}>
                                                &times;
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )
                    })}
                </div>

                <div className="form-actions">
                    <button type="button" className="submit-btn outline medium" onClick={onClose}>닫기</button>
                </div>
            </div>
        </div>,
        document.body
    );
}

export default CategoryModal;