const express = require('express')
const router = express.Router()
const { users } = require('../users')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const secret = process.env.JWT_SECRET || 'devsecret'

router.post('/register', async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) return res.status(400).json({ error: 'username and password required' })
  if (users.find((u) => u.username === username)) return res.status(400).json({ error: 'username taken' })
  const hash = bcrypt.hashSync(password, 8)
  const user = { id: 'u' + Date.now(), username, password: hash }
  users.push(user)
  const token = jwt.sign({ id: user.id, username: user.username }, secret, { expiresIn: '7d' })
  res.json({ token, user: { id: user.id, username: user.username } })
})

router.post('/login', async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) return res.status(400).json({ error: 'username and password required' })
  const user = users.find((u) => u.username === username)
  if (!user) return res.status(400).json({ error: 'invalid credentials' })
  const ok = bcrypt.compareSync(password, user.password)
  if (!ok) return res.status(400).json({ error: 'invalid credentials' })
  const token = jwt.sign({ id: user.id, username: user.username }, secret, { expiresIn: '7d' })
  res.json({ token, user: { id: user.id, username: user.username } })
})

module.exports = router
