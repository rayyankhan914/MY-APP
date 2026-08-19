const express = require('express');
const router = express.Router();
const { videos } = require('../data');
const jwt = require('jsonwebtoken')
const secret = process.env.JWT_SECRET || 'devsecret'
const { users } = require('../users')
const auth = require('../middleware/auth')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
let sharp
try { sharp = require('sharp') } catch (e) { console.warn('sharp not available, thumbnail resizing disabled') }

// storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsRoot = path.join(__dirname, '..', 'uploads')
    if (file.fieldname === 'video') cb(null, path.join(uploadsRoot, 'videos'))
    else cb(null, path.join(uploadsRoot, 'thumbs'))
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1e9) + ext)
  }
})

const upload = multer({ storage })

// list videos, support simple search via ?q=term
router.get('/', (req, res) => {
  const q = (req.query.q || '').toLowerCase().trim();
  if (!q) return res.json(videos);
  const filtered = videos.filter((v) => (v.title + ' ' + (v.description || '')).toLowerCase().includes(q));
  res.json(filtered);
});

router.get('/:id', (req, res) => {
  const v = videos.find((x) => x.id === req.params.id);
  if (!v) return res.status(404).json({ error: 'Not found' });
  res.json(v);
});

// create by URL (existing behavior)
router.post('/', auth, (req, res) => {
  const { title, description, url, thumbnail } = req.body;
  if (!title || !url) return res.status(400).json({ error: 'title and url required' });
  const id = String(Date.now())
  const video = { id, title, description: description || '', url, thumbnail: thumbnail || '', likes: 0, comments: [], ownerId: req.user && req.user.id ? req.user.id : null };
  videos.unshift(video);
  try { const { saveVideos } = require('../data'); saveVideos() } catch (e) { console.error('saveVideos failed', e && e.message) }
  res.status(201).json(video);
});

// upload video file (+ optional thumbnail)
router.post('/upload', auth, upload.fields([{ name: 'video', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), async (req, res) => {
  try {
    if (!req.files || !req.files.video || !req.files.video[0]) return res.status(400).json({ error: 'video file required' })
    const videoFile = req.files.video[0]
    const uploadsRoot = path.join(__dirname, '..', 'uploads')
    // ensure thumbs folder exists
    const thumbsFolder = path.join(uploadsRoot, 'thumbs')
    if (!fs.existsSync(thumbsFolder)) fs.mkdirSync(thumbsFolder, { recursive: true })

    const videoUrl = `/uploads/videos/${videoFile.filename}`
    let thumbFilename
    if (req.files.thumbnail && req.files.thumbnail[0]) {
      const t = req.files.thumbnail[0]
      const ext = path.extname(t.originalname) || '.jpg'
      thumbFilename = videoFile.filename + '-thumb' + ext
      const dest = path.join(thumbsFolder, thumbFilename)
      fs.renameSync(t.path, dest)
    } else {
      // create a simple SVG placeholder
      thumbFilename = videoFile.filename + '-thumb.svg'
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180"><rect width="100%" height="100%" fill="#cccccc"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#666" font-size="20">No thumbnail</text></svg>`
      fs.writeFileSync(path.join(thumbsFolder, thumbFilename), svg)
    }

    // create resized variants if sharp is available
    const originalThumbPath = path.join(thumbsFolder, thumbFilename)
    let chosenThumb = thumbFilename
    if (sharp && fs.existsSync(originalThumbPath)) {
      try {
        // detect if SVG content to avoid unsupported format errors
        let isSvgThumb = false
        try {
          const sampleT = fs.readFileSync(originalThumbPath, { encoding: 'utf8', flag: 'r' }).slice(0, 512)
          if (sampleT && sampleT.toLowerCase().includes('<svg')) isSvgThumb = true
        } catch (e) {
          isSvgThumb = false
        }
        if (!isSvgThumb) {
          const small = videoFile.filename + '-thumb-320.jpg'
          const medium = videoFile.filename + '-thumb-640.jpg'
          await sharp(originalThumbPath).resize(320, 180).jpeg({ quality: 75 }).toFile(path.join(thumbsFolder, small))
          await sharp(originalThumbPath).resize(640, 360).jpeg({ quality: 80 }).toFile(path.join(thumbsFolder, medium))
          chosenThumb = small
        } else {
          // if original is SVG, try to rasterize into JPEG thumbnails
          try {
            const small = videoFile.filename + '-thumb-320.jpg'
            const medium = videoFile.filename + '-thumb-640.jpg'
            await sharp(originalThumbPath).jpeg({ quality: 75 }).resize(320, 180).toFile(path.join(thumbsFolder, small))
            await sharp(originalThumbPath).jpeg({ quality: 80 }).resize(640, 360).toFile(path.join(thumbsFolder, medium))
            chosenThumb = small
          } catch (err) {
            console.error('svg thumbnail conversion failed', err && err.message)
          }
        }
      } catch (err) {
        console.error('thumbnail resize failed', err && err.message)
      }
    }

    const thumbnailUrl = `/uploads/thumbs/${chosenThumb}`
    const { title, description } = req.body
    const id = String(Date.now())
    const video = { id, title: title || 'Untitled', description: description || '', url: videoUrl, thumbnail: thumbnailUrl, likes: 0, comments: [], ownerId: req.user && req.user.id ? req.user.id : null }
    videos.unshift(video)
    try { const { saveVideos } = require('../data'); saveVideos() } catch (e) { console.error('saveVideos failed', e && e.message) }
    res.status(201).json(video)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'upload failed' })
  }
})

// like a video
router.post('/:id/like', auth, (req, res) => {
  const v = videos.find((x) => x.id === req.params.id);
  if (!v) return res.status(404).json({ error: 'Not found' });
  v.likes = (v.likes || 0) + 1;
  res.json({ likes: v.likes });
});

// record a view (increments view count; if authenticated, append to user history)
router.post('/:id/view', async (req, res) => {
  const v = videos.find((x) => x.id === req.params.id);
  if (!v) return res.status(404).json({ error: 'Not found' });
  v.views = (v.views || 0) + 1
  try { const { saveVideos } = require('../data'); saveVideos() } catch (e) { console.error('saveVideos failed', e && e.message) }

  const h = req.headers.authorization || ''
  if (h.startsWith('Bearer ')) {
    const token = h.slice(7)
    try {
      const payload = jwt.verify(token, secret)
      const user = users.find((u) => u.id === payload.id)
      if (user) {
        user.history = user.history || []
        // remove existing entry for this video to avoid duplicates
        const existing = user.history.findIndex((h) => h.videoId === v.id)
        if (existing !== -1) user.history.splice(existing, 1)
        user.history.unshift({ videoId: v.id, watchedAt: Date.now() })
        if (user.history.length > 200) user.history.length = 200
        try { const { saveUsers } = require('../users'); saveUsers() } catch (e) { console.error('saveUsers failed', e && e.message) }
      }
    } catch (err) {
      // ignore invalid token for view tracking
    }
  }

  res.json({ views: v.views })
})

module.exports = router;
