import React, { useState } from 'react'
import './Sidebar.scss';
import { useAuthStore } from '../../../store/useAuthStore';
import { useTodoStore } from '../../../store/useTodoStore';         // 추가
import { useCategoryStore } from '../../../store/useCategoryStore'; // 추가
import { Link, useNavigate } from 'react-router-dom';
import { 
  IoCalendarNumberOutline, IoCalendarOutline, IoLogOutOutline, 
  IoTodayOutline, IoAddCircle, IoSettingsSharp 
} from "react-icons/io5"; // 아이콘 추가
import { FaUserCircle } from "react-icons/fa";

function Sidebar() {
  const userInfo = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  
  // 모달을 여는 함수를 스토어에서 가져옵니다.
  // (store에 open 함수가 구현되어 있다고 가정합니다. 예: openCreateModal)
  const { openCreateModal } = useTodoStore(); 
  const { openManageModal } = useCategoryStore();

  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  const menuItems = [
    { name: '오늘', link: 'todos?filter=today', icon: <IoTodayOutline /> },
    { name: '어제', link: 'todos?filter=yesterday', icon: <IoCalendarNumberOutline /> },
    { name: '내일', link: 'todos?filter=tomorrow', icon: <IoCalendarNumberOutline /> },
    { name: '이번 주', link: 'todos?filter=week', icon: <IoCalendarOutline /> },
    { name: '월간 일정', link: 'todos?filter=all', icon: <IoCalendarOutline /> }
  ];

  const handleLogout = () => {
    if (logout) logout(); 
    navigate('/'); 
  };

  return (
    <div className='sidebar-container'>
      {/* 1. 프로필 영역 */}
      <div className='profile-header'>
        <div className='user-info'>
            <FaUserCircle className='avatar-icon'/>
            <span className='username'>{userInfo.data.u_name}</span>
        </div>
      </div>

      {/* 2. 액션 버튼 영역 (새로 추가) */}
      <div className='action-section'>
        {/* 중요: 일정 등록 버튼 (강조됨) */}
        <button className='action-btn primary' onClick={openCreateModal}>
          <span className='icon'><IoAddCircle /></span>
          <span className='text'>일정 등록</span>
        </button>

        {/* 보조: 카테고리 관리 버튼 */}
        <button className='action-btn secondary' onClick={openManageModal}>
          <span className='icon'><IoSettingsSharp /></span>
          <span className='text'>카테고리 관리</span>
        </button>
      </div>
      
      {/* 구분선 (선택사항) */}
      <hr className='divider' />

      {/* 3. 메뉴 리스트 (네비게이션) */}
      <ul className='menu-list'>
        {menuItems.map((item, index) => (
          <li key={index} 
              className={`menu-item ${activeIndex === index ? 'active' : ''}`}
              onClick={() => setActiveIndex(index)}>
            <Link className='link' to={item.link}>
              <span className='icon'>{item.icon}</span>
              <span className='text'>{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>

      {/* 4. 로그아웃 버튼 (하단 고정) */}
      <div className='logout-section'>
        <button className='logout-btn' onClick={handleLogout}>
            <span className='icon'><IoLogOutOutline /></span>
            <span className='text'>로그아웃</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar

// import React, { useEffect, useState } from 'react'
// import './Sidebar.scss';
// import { useAuthStore } from '../../../store/useAuthStore';
// import { Link, useNavigate } from 'react-router-dom';
// import { IoLogOutOutline } from "react-icons/io5";
// import { useTodoStore } from '../../../store/useTodoStore';
// import { useCategoryStore } from '../../../store/useCategoryStore';

// function Sidebar() {
//   const openCreateModal = useTodoStore((s) => s.openCreateModal);
//   const openManageModal = useCategoryStore((s) => s.openManageModal);
//   const userInfo = useAuthStore((s) => s.user);
//   const [activeIndex, setActiveIndex] = useState(0);
//    const menuItems = [
//     // {name: '검색', link: 'search'},
//     {name: '오늘', link: 'todos?filter=today'},
//     {name: '어제', link: 'todos?filter=yesterday'},
//     {name: '내일', link: 'todos?filter=tomorrow'},
//     {name: '이번 주', link: 'todos?filter=week'},
//     {name: '월간 일정', link: 'content'}
//   ];

//   return (
//     <div className='sidebar-container'>
//       <div className='userinfo-section'>
//         <span className='userinfo'>
//           {userInfo.data.u_name}
//         </span>
//         <button><span className='logouticon'><IoLogOutOutline /></span></button>
//       </div>
//       <div className='menu-section'>
//         <ul className='ul'>
//           {menuItems.map((item, index) => (
//             <Link className='link' to={item.link}>
//               <li key={index}
//                 className={`li ${activeIndex === index ? 'on' : ''}`}
//                 onClick={() => setActiveIndex(index)}>
//                   <p>{item.name}</p>
//               </li>
//             </Link>
//         ))}
//         </ul>
//         <div className='modal-section'>
//           <button onClick={openCreateModal}>일정등록</button>
//           <button onClick={openManageModal}>카테고리 관리</button>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Sidebar
