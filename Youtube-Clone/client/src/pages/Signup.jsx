import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api, { setAuthToken } from '../api'

export default function Signup() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [debug, setDebug] = useState(null)
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
      // show detailed error so it's easier to diagnose client/server failures
      console.error('Signup error:', err)
      const serverMsg = err?.response?.data?.error
      const status = err?.response?.status
      // capture full response for debug UI
      setDebug(err?.response?.data || { message: err.message, status })
      const msg = serverMsg || err?.message || 'Registration failed'
      alert(msg + (status ? ` (status ${status})` : ''))
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
      {debug && (
        <pre style={{ background: '#111', color: '#fff', padding: 8, marginTop: 12, maxHeight: 240, overflow: 'auto' }}>
          {JSON.stringify(debug, null, 2)}
        </pre>
      )}
    </div>
  )
}
