import React, { useState } from 'react'
import api from '../services/api'

export default function Login(){
  const [email, setEmail] = useState('admin@mil.gov')
  const [password, setPassword] = useState('Admin@123')
  const [err, setErr] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await api.post('/api/auth/login', { email, password })
      localStorage.setItem('token', data.token)
      localStorage.setItem('role', data.role)
      localStorage.setItem('name', data.name)
      if (data.baseId) localStorage.setItem('baseId', data.baseId)
      window.location.href = '/'
    } catch (e) {
      setErr(e.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="h-screen grid place-items-center bg-gray-50 p-4">
      <form onSubmit={submit} className="bg-white p-6 rounded-2xl shadow max-w-sm w-full space-y-4">
        <h1 className="text-xl font-bold">Sign in</h1>
        <div className="grid gap-2">
          <label className="text-sm">Email</label>
          <input className="border rounded-xl p-2" value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <label className="text-sm">Password</label>
          <input type="password" className="border rounded-xl p-2" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        {err && <div className="text-sm text-red-600">{err}</div>}
        <button className="w-full py-2 rounded-xl bg-black text-white">Login</button>
        <p className="text-xs text-gray-500">Try: admin@mil.gov / Admin@123</p>
      </form>
    </div>
  )
}
