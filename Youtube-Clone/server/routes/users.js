const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { users } = require('../users')
const { videos } = require('../data')

// return current user info and their videos
router.get('/me', auth, (req, res) => {
  const user = users.find((u) => u.id === req.user.id)
  if (!user) return res.status(404).json({ error: 'User not found' })
  const myVideos = videos.filter((v) => v.ownerId === user.id)
  res.json({ user: { id: user.id, username: user.username }, videos: myVideos })
})

module.exports = router
