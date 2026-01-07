import React, { useState } from 'react'
import './Sidebar.scss';
import { useAuthStore } from '../../../store/useAuthStore';
import { Link, useNavigate } from 'react-router-dom';
// 로그아웃 아이콘 추가
import { IoSearchOutline, IoCalendarOutline, IoCalendarNumberOutline, IoAddCircleOutline, IoLogOutOutline } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";

function Sidebar() {
  const userInfo = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout); // store에 logout 액션이 있다고 가정
  // 만약 store에 logout 함수가 없다면: const setUser = useAuthStore((s) => s.setUser); 등으로 대체

  const [activeIndex, setActiveIndex] = useState(1);
  const navigate = useNavigate();

  const menuItems = [
    {name: '검색', link: 'search', icon: <IoSearchOutline />},
    {name: '오늘', link: 'today', icon: <IoCalendarNumberOutline />},
    {name: '일정 확인', link: 'content', icon: <IoCalendarOutline />},
    {name: '일정 등록', link: 'content', icon: <IoAddCircleOutline />} 
  ];

  const handleLogout = () => {
    // 1. 스토어 상태 비우기 (예시)
    if (logout) logout(); 
    // 2. 로그인 페이지로 이동
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

      {/* 2. 메뉴 리스트 */}
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

      {/* 3. 로그아웃 버튼 (하단 고정) */}
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