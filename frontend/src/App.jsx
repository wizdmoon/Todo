import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Route, Routes } from 'react-router-dom';
import Login from './pages/login/Login';
import Join from './pages/login/components/Join';
import Main from './pages/main/Main';

function App() {

  return (
    <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/login" element={<Login />} />
            <Route path="/join" element={<Join />} />
    </Routes>
  )
}

export default App
