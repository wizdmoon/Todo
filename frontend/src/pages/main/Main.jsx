import React, { useEffect } from 'react'
import LoginForm from './components/LoginForm'
import Banner from './components/Banner'
import Join from './components/Join'
import './Main.scss'
import { useAuthStore } from '../../store/useAuthStore'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

function Main() {
  const [mode, setMode] = useState('login');
  const userInfo = useAuthStore((s) => s.user);

  const navigate = useNavigate();

  return (
    <div className='main-container'>
        <div className='banner-section'>
            <Banner />
        </div>
        <div className='form-section'>
            {/* <LoginForm /> */}
            {mode === 'login' ? (
              <LoginForm onJoinClick={() => setMode('join')} />
            ) : (
              <Join onCancel={() => setMode('login')} />
            )}
        </div>
    </div>
  )
}

export default Main