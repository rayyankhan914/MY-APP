import React from 'react'
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Watch from './pages/Watch'
import Upload from './pages/Upload'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import { setAuthToken } from './api'
import { SearchProvider, useSearch } from './search/SearchContext'
import TopProgress from './components/TopProgress'

export default function App() {
  const navigate = useNavigate()
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  return (
    <SearchProvider debounceMs={200}>
      <InnerApp token={token} navigate={navigate} />
    </SearchProvider>
  )
}

function InnerApp({ token, navigate }) {
  const { query, setQuery, loading } = useSearch()
  const [navLoading, setNavLoading] = React.useState(false)
  const location = useLocation()

  React.useEffect(() => {
    function onClick(e) {
      const a = e.target.closest && e.target.closest('a')
      if (!a) return
      try {
        const href = a.getAttribute('href')
        if (!href || (href.startsWith('http') && new URL(href).origin !== window.location.origin)) return
        setNavLoading(true)
      } catch (err) {
        // ignore
      }
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  React.useEffect(() => {
    if (navLoading) {
      const t = setTimeout(() => setNavLoading(false), 420)
      return () => clearTimeout(t)
    }
  }, [location.key])

  function logout() {
    localStorage.removeItem('token')
    setAuthToken(null)
    navigate('/')
  }

  function onSearchSubmit(e) {
    e.preventDefault()
  }

  return (
    <div className="app">
      <TopProgress loading={loading || navLoading} />

      <header className="header">
        <div className="header-inner">
          <Link to="/" className="brand">YouTube Clone</Link>

          <form className="search-form" onSubmit={onSearchSubmit} role="search">
            <input
              className="search-input"
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="search-btn" type="submit">
              {loading ? <span className="spinner" aria-hidden /> : 'Search'}
            </button>
          </form>

          <nav className="header-nav">
            <Link to="/upload" className="upload-link">Upload</Link>
            {!token ? (
              <>
                <Link to="/login" className="auth-link">Login</Link>
                <Link to="/signup" className="auth-link">Sign up</Link>
              </>
            ) : (
              <>
                <Link to="/profile" className="auth-link">Profile</Link>
                <button onClick={logout} className="auth-link">Logout</button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/watch/:id" element={<Watch />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </div>
  )
}
