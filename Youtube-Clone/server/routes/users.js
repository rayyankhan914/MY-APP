const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { users } = require('../users')
const { videos } = require('../data')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
let sharp
try { sharp = require('sharp') } catch (e) { console.warn('sharp not available, image resizing disabled') }

// return current user info and their videos
router.get('/me', auth, (req, res) => {
  // prefer stored user record, but fall back to token payload when server state was lost
  const user = users.find((u) => u.id === req.user.id)
  const payloadUser = { id: req.user.id, username: req.user.username }
  const useUser = user ? { id: user.id, username: user.username, about: user.about, avatar: user.avatar, cover: user.cover } : payloadUser
  const myVideos = videos.filter((v) => v.ownerId === useUser.id)
  // include watch history (full video objects with watchedAt)
  const history = (user && Array.isArray(user.history) ? user.history : []).map((h) => {
    const vid = videos.find((v) => v.id === h.videoId)
    if (!vid) return null
    return { ...vid, watchedAt: h.watchedAt }
  }).filter(Boolean)
  res.json({ user: useUser, videos: myVideos, history })
})

// storage for avatar/cover uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsRoot = path.join(__dirname, '..', 'uploads')
    if (file.fieldname === 'avatar') cb(null, path.join(uploadsRoot, 'avatars'))
    else cb(null, path.join(uploadsRoot, 'covers'))
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || ''
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1e9) + ext)
  }
})

const upload = multer({ storage })

// update profile (about + optional avatar/cover files)
router.post('/me', auth, upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), async (req, res) => {
  try {
    const { about } = req.body
  let user = users.find((u) => u.id === req.user.id)
  if (!user) {
    // create minimal user record from token payload
    user = { id: req.user.id, username: req.user.username }
    users.push(user)
    try { const { saveUsers } = require('../users'); saveUsers() } catch (e) { console.error('saveUsers failed', e && e.message) }
  }
  if (about !== undefined) user.about = about
    if (req.files && req.files.avatar && req.files.avatar[0]) {
      const f = req.files.avatar[0]
      const avatarPath = path.join(__dirname, '..', 'uploads', 'avatars', f.filename)
      // create resized avatar variants if sharp is available and file is not SVG
      const ext = path.extname(f.originalname || f.filename).toLowerCase()
      if (sharp) {
        // detect SVG content even when filename may lack .svg extension
        let isSvg = false
        try {
          const sample = fs.readFileSync(avatarPath, { encoding: 'utf8', flag: 'r' }).slice(0, 512)
          if (sample && sample.toLowerCase().includes('<svg')) isSvg = true
        } catch (e) {
          isSvg = false
        }
        if (!isSvg && ext !== '.svg') {
          try {
            await sharp(avatarPath).resize(128, 128).toFile(avatarPath + '-128.jpg')
            await sharp(avatarPath).resize(64, 64).toFile(avatarPath + '-64.jpg')
            user.avatar = `/uploads/avatars/${f.filename}-128.jpg`
          } catch (err) {
            console.error('avatar resize failed', err && err.message)
            user.avatar = `/uploads/avatars/${f.filename}`
          }
        } else {
          // if it's SVG, try to rasterize into PNG/JPEG variants
          user.avatar = `/uploads/avatars/${f.filename}`
          if (isSvg) {
            try {
              const png128 = f.filename + '-128.png'
              const png64 = f.filename + '-64.png'
              await sharp(avatarPath).png().resize(128, 128).toFile(path.join(__dirname, '..', 'uploads', 'avatars', png128))
              await sharp(avatarPath).png().resize(64, 64).toFile(path.join(__dirname, '..', 'uploads', 'avatars', png64))
              user.avatar = `/uploads/avatars/${png128}`
            } catch (err) {
              console.error('avatar svg->png conversion failed', err && err.message)
            }
          }
        }
      } else {
        user.avatar = `/uploads/avatars/${f.filename}`
      }
    }
    if (req.files && req.files.cover && req.files.cover[0]) {
      const f = req.files.cover[0]
      const coverPath = path.join(__dirname, '..', 'uploads', 'covers', f.filename)
      const extC = path.extname(f.originalname || f.filename).toLowerCase()
      if (sharp) {
        let isSvgC = false
        try {
          const sampleC = fs.readFileSync(coverPath, { encoding: 'utf8', flag: 'r' }).slice(0, 512)
          if (sampleC && sampleC.toLowerCase().includes('<svg')) isSvgC = true
        } catch (e) {
          isSvgC = false
        }
        if (!isSvgC && extC !== '.svg') {
          try {
            await sharp(coverPath).resize(1200, 300).toFile(coverPath + '-1200x300.jpg')
            user.cover = `/uploads/covers/${f.filename}-1200x300.jpg`
          } catch (err) {
            console.error('cover resize failed', err && err.message)
            user.cover = `/uploads/covers/${f.filename}`
          }
        } else {
          // try rasterizing SVG cover into JPEG/PNG fallback
          user.cover = `/uploads/covers/${f.filename}`
          if (isSvgC) {
            try {
              const pngCover = f.filename + '-1200x300.png'
              await sharp(coverPath).png().resize(1200, 300).toFile(path.join(__dirname, '..', 'uploads', 'covers', pngCover))
              user.cover = `/uploads/covers/${pngCover}`
            } catch (err) {
              console.error('cover svg->png conversion failed', err && err.message)
            }
          }
        }
      } else {
        user.cover = `/uploads/covers/${f.filename}`
      }
    }
    try { const { saveUsers } = require('../users'); saveUsers() } catch (e) { console.error('saveUsers failed', e && e.message) }
    res.json({ user: { id: user.id, username: user.username, about: user.about || '', avatar: user.avatar || '', cover: user.cover || '' } })
  } catch (err) {
    console.error('profile update error', err && err.message)
    res.status(500).json({ error: 'profile update failed' })
  }
})

module.exports = router

// history endpoints
// GET /api/users/history -> returns user's history as full video objects
router.get('/history', auth, (req, res) => {
  const user = users.find((u) => u.id === req.user.id)
  const mapped = (user && Array.isArray(user.history) ? user.history : []).map((h) => {
    const vid = videos.find((v) => v.id === h.videoId)
    if (!vid) return null
    return { ...vid, watchedAt: h.watchedAt }
  }).filter(Boolean)

  // pagination
  const offset = Math.max(0, parseInt(req.query.offset || '0'))
  const limit = Math.min(200, Math.max(1, parseInt(req.query.limit || '20')))
  const items = mapped.slice(offset, offset + limit)
  res.json({ items, total: mapped.length, offset, limit })
})

// DELETE /api/users/history -> clears user's history
router.delete('/history', auth, (req, res) => {
  const user = users.find((u) => u.id === req.user.id)
  if (!user) return res.status(404).json({ error: 'User not found' })
  user.history = []
  try { const { saveUsers } = require('../users'); saveUsers() } catch (e) { console.error('saveUsers failed', e && e.message) }
  res.json({ ok: true })
})

// DELETE /api/users/history/:videoId -> remove a single history entry
router.delete('/history/:videoId', auth, (req, res) => {
  const user = users.find((u) => u.id === req.user.id)
  if (!user) return res.status(404).json({ error: 'User not found' })
  const vid = req.params.videoId
  const idx = (user.history || []).findIndex((h) => h.videoId === vid)
  if (idx === -1) return res.status(404).json({ error: 'Not found' })
  user.history.splice(idx, 1)
  try { const { saveUsers } = require('../users'); saveUsers() } catch (e) { console.error('saveUsers failed', e && e.message) }
  res.json({ ok: true })
})

// POST /api/users/history -> add a single history entry (no view increment)
router.post('/history', auth, (req, res) => {
  const { videoId, watchedAt } = req.body
  if (!videoId) return res.status(400).json({ error: 'videoId required' })
  const user = users.find((u) => u.id === req.user.id)
  if (!user) return res.status(404).json({ error: 'User not found' })
  user.history = user.history || []
  const existing = user.history.findIndex((h) => h.videoId === videoId)
  if (existing !== -1) user.history.splice(existing, 1)
  user.history.unshift({ videoId, watchedAt: watchedAt || Date.now() })
  if (user.history.length > 200) user.history.length = 200
  try { const { saveUsers } = require('../users'); saveUsers() } catch (e) { console.error('saveUsers failed', e && e.message) }
  res.json({ ok: true })
})
