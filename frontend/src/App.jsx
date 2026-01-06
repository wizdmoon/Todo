import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Route, Routes } from 'react-router-dom';
import Login from './pages/login/Login';
import Main from './pages/main/main';

function App() {

  return (
    <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/login" element={<Login />} />
    </Routes>
  )
}

export default App
