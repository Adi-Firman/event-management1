'use client'

import React, { useState } from 'react'
import axios from 'axios'
import jwtDecode from 'jwt-decode'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await axios.post('http://localhost:5000/api/login', {
        email,
        password,
      })

      const { token } = res.data
      localStorage.setItem('token', token)

      const decoded: any = jwtDecode(token)
      const role = decoded.role

      // Redirect berdasarkan role
      if (role === 'organizer') {
        router.push('/dashboard/organizer')
      } else if (role === 'customer') {
        router.push('/dashboard/customer')
      } else {
        router.push('/')
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-2 border"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-2 border"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-blue-500 text-white p-2">Login</button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  )
}
