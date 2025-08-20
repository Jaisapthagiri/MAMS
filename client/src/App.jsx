import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Purchases from './pages/Purchases.jsx'
import Transfers from './pages/Transfers.jsx'
import Assignments from './pages/Assignments.jsx'
import { Navbar } from './components/Navbar.jsx'

const Protected = ({ children }) => {
  const token = localStorage.getItem('token')
  if (!token) return <Navigate to="/login" />
  return children
}

export default function App(){
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={
          <Protected>
            <div className="max-w-7xl mx-auto p-4 space-y-4">
              <Navbar />
              <Routes>
                <Route index element={<Dashboard />} />
                <Route path="purchases" element={<Purchases />} />
                <Route path="transfers" element={<Transfers />} />
                <Route path="assignments" element={<Assignments />} />
              </Routes>
            </div>
          </Protected>
        }/>
      </Routes>
    </div>
  )
}
