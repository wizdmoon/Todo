import React, { useEffect } from 'react'
import './dashboard.scss'
import Sidebar from './components/Sidebar'
import Content from './components/Content'
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import useCategories from '../../hooks/useCategories';
import { useCategoryStore } from '../../store/useCategoryStore'
import TodoModal from './components/TodoModal';
import { useTodoStore } from '../../store/useTodoStore';
import CategoryModal from './components/CategoryModal';
import TodoInfoModal from './components/TodoInfoModal';

function Dashboard() {
  const userInfo = useAuthStore((s) => s.user);
  console.log('userInfo: ', userInfo.data);
  console.log('userIdx: ', userInfo.data.idx);
  console.log('userID: ', userInfo.data.u_id);
  const categoryList = useCategoryStore((s) => s.categories);
  const { isCreateModalOpen, closeCreateModal } = useTodoStore();
  const { isManageModalOpen, closeManageModal } = useCategoryStore();
  const { isInfoModalOpen, closeInfoModal } = useTodoStore();


  console.log(categoryList);

  const { isLoading } = useCategories(userInfo.data.idx);

  console.log(isLoading)

  const navigate = useNavigate();

  useEffect(() => {
    if( userInfo === null ){
      navigate('/')
    }
    navigate('/dashboard/todos?filter=today')
  }, []);

  return (
    <div className='dashboard-container'>
        <div className='sidebar-section'>
            <Sidebar />
        </div>
        <div className='content-section'>
            <Outlet />
        </div>
        {isCreateModalOpen && (
        <TodoModal 
        isOpen={isCreateModalOpen} 
        onClose={closeCreateModal} 
      />
        )}
        {isManageModalOpen && (
        <CategoryModal 
        isOpen={isManageModalOpen} 
        onClose={closeManageModal} 
      />
        )}

        {isInfoModalOpen && (
        <TodoInfoModal 
        isOpen={isInfoModalOpen} 
        onClose={closeInfoModal} 
      />
        )}


    </div>
  )
}

export default Dashboard