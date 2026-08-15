const express = require('express');
const router = express.Router({ mergeParams: true });
const { videos } = require('../data');

// GET /api/videos/:id/comments
router.get('/', (req, res) => {
  const video = videos.find((v) => v.id === req.params.id);
  if (!video) return res.status(404).json({ error: 'Not found' });
  res.json(video.comments || []);
});

// POST /api/videos/:id/comments
const auth = require('../middleware/auth')

router.post('/', auth, (req, res) => {
  const video = videos.find((v) => v.id === req.params.id);
  if (!video) return res.status(404).json({ error: 'Not found' });
  const { author, text } = req.body;
  if (!text) return res.status(400).json({ error: 'text required' });
  const comment = { id: 'c' + Date.now(), author: author || 'Anonymous', text, createdAt: Date.now() };
  video.comments = video.comments || [];
  video.comments.push(comment);
  res.status(201).json(comment);
});

module.exports = router;
