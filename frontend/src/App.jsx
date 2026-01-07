import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Route, Routes } from 'react-router-dom';
import Join from './pages/main/components/Join';
import Main from './pages/main/Main';
import Dashboard from './pages/dashboard/Dashboard';
import Content from './pages/dashboard/components/Content';
import Today from './pages/dashboard/components/Today';
import Search from './pages/dashboard/components/Search';

function App() {

  return (
    <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/join" element={<Join />} />
            <Route path="/dashboard" element={<Dashboard />}>
              <Route path='today' element={<Today />}></Route>
              <Route path='search' element={<Search />}></Route>
              <Route path='content' element={<Content />}></Route>
            </Route>
    </Routes>
  )
}

export default App
