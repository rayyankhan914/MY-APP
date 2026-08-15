import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api, { setAuthToken } from '../api'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  async function submit(e) {
    e.preventDefault()
    try {
      const res = await api.post('/auth/login', { username, password })
      const { token } = res.data
      localStorage.setItem('token', token)
      setAuthToken(token)
      navigate('/')
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed')
    }
  }

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={submit} className="form">
        <label>Username<input value={username} onChange={(e)=>setUsername(e.target.value)} /></label>
        <label>Password<input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} /></label>
        <button type="submit">Login</button>
      </form>
    </div>
  )
}
