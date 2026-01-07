import React from 'react'
import './Content.scss'
import { useAuthStore } from '../../../store/useAuthStore';

function Content() {
  const userInfo = useAuthStore((s) => s.user);
  return (
    <div className='content-container'>Content</div>
  )
}

export default Content