import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api, { setAuthToken } from '../api'

export default function Signup() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  async function submit(e) {
    e.preventDefault()
    try {
      const res = await api.post('/auth/register', { username, password })
      const { token } = res.data
      localStorage.setItem('token', token)
      setAuthToken(token)
      navigate('/')
    } catch (err) {
      alert(err.response?.data?.error || 'Registration failed')
    }
  }

  return (
    <div className="container">
      <h2>Sign up</h2>
      <form onSubmit={submit} className="form">
        <label>Username<input value={username} onChange={(e)=>setUsername(e.target.value)} /></label>
        <label>Password<input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} /></label>
        <button type="submit">Create account</button>
      </form>
    </div>
  )
}
