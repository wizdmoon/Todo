import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Route, Routes } from 'react-router-dom';
import Join from './pages/main/components/Join';
import Main from './pages/main/Main';
import Dashboard from './pages/dashboard/Dashboard';
import TodoPage from './pages/dashboard/components/TodoPage';
import Search from './pages/dashboard/components/Search';
import Today from './pages/dashboard/components/Today';
import Content from './pages/dashboard/components/Content';

function App() {

  return (
    <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/join" element={<Join />} />
            <Route path="/dashboard" element={<Dashboard />}>
              <Route path="todos" element={<TodoPage />} />
              {/* <Route path="todos" element={<Today />} /> */}
              {/* <Route path="content" element={<Content />} /> */}
              {/* <Route path='search' element={<Search />} /> */}
            </Route>
    </Routes>
  )
}

export default App
