const express = require('express');
const router = express.Router();
const { videos } = require('../data');
const auth = require('../middleware/auth')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

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
  const id = String(Date.now());
  const video = { id, title, description: description || '', url, thumbnail: thumbnail || '', likes: 0, comments: [], ownerId: req.user && req.user.id ? req.user.id : null };
  videos.unshift(video);
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

    const thumbnailUrl = `/uploads/thumbs/${thumbFilename}`
    const { title, description } = req.body
    const id = String(Date.now())
    const video = { id, title: title || 'Untitled', description: description || '', url: videoUrl, thumbnail: thumbnailUrl, likes: 0, comments: [], ownerId: req.user && req.user.id ? req.user.id : null }
    videos.unshift(video)
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

module.exports = router;
