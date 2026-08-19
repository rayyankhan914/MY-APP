import React from 'react'
import { Link } from 'react-router-dom'

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <nav className="side-nav">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/subscriptions">Subscriptions</Link></li>
          <li><Link to="/library">Library</Link></li>
          <li><Link to="/history">History</Link></li>
          <li><Link to="/watch-later">Watch later</Link></li>
          <li><Link to="/liked">Liked videos</Link></li>
          <li><Link to="/upload">Upload</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/settings">Settings</Link></li>
        </ul>
      </nav>
    </aside>
  )
}
