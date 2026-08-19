const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const videos = require('./routes/videos');

const app = express();
app.use(cors());
// parse JSON safely: catch body-parser errors and return 400 instead of crashing
app.use((req, res, next) => {
	express.json()(req, res, (err) => {
		if (err) {
			console.error('JSON parse error:', err && err.message)
			return res.status(400).json({ error: 'Invalid JSON' })
		}
		next()
	})
})

// ensure uploads folders exist
const uploadsDir = path.join(__dirname, 'uploads');
const videosDir = path.join(uploadsDir, 'videos');
const thumbsDir = path.join(uploadsDir, 'thumbs');
const avatarsDir = path.join(uploadsDir, 'avatars');
const coversDir = path.join(uploadsDir, 'covers');
[uploadsDir, videosDir, thumbsDir, avatarsDir, coversDir].forEach((d) => { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }) });

// serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/videos', videos);
app.use('/api/videos/:id/comments', require('./routes/comments'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server listening on ${port}`));
