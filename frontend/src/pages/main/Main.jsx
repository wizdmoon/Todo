import React from 'react'
import LoginForm from './components/LoginForm'
import Banner from './components/Banner'

function Main() {
  return (
    <div className='main-container'>
        <div className='banner-section'>
            <Banner />
        </div>
        <div className='login-section'>
            <LoginForm />
        </div>
    </div>
  )
}

export default Main