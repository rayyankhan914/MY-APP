import React from 'react'
import pkg from '../../package.json'

export default function Footer() {
  const year = new Date().getFullYear()
  const version = pkg?.version || ''
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-col">
          <h4>About</h4>
          <p>Minimal YouTube-like demo built with React + Express. Upload, search, like, and comment on videos.</p>
        </div>

        <div className="footer-col">
          <h4>Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/upload">Upload</a></li>
            <li><a href="/profile">Profile</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Contact</h4>
          <p>dev@example.com</p>
          <p className="muted">© {year} YouTube Clone</p>
          {version && <p className="muted">v{version}</p>}
          <div style={{marginTop:8}}>
            <a href="https://github.com/" target="_blank" rel="noreferrer">GitHub</a> ·
            <a href="https://twitter.com/" target="_blank" rel="noreferrer" style={{marginLeft:6}}>Twitter</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
