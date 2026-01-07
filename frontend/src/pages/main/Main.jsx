import React, { useEffect } from 'react'
import LoginForm from './components/LoginForm'
import Banner from './components/Banner'
import './Main.scss'
import { useAuthStore } from '../../store/useAuthStore'
import { useNavigate } from 'react-router-dom'

function Main() {
  const userInfo = useAuthStore((s) => s.user);

  const navigate = useNavigate();

  // useEffect(() => {
  //   if(userInfo){
  //     navigate('/dashboard')
  //   }
  // }, []);
  return (
    <div className='main-container'>
        <div className='banner-section'>
            <Banner />
        </div>
        <div className='form-section'>
            <LoginForm />
        </div>
    </div>
  )
}

export default Main