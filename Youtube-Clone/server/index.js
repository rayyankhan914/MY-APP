const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const videos = require('./routes/videos');

const app = express();
app.use(cors());
app.use(express.json());

// ensure uploads folders exist
const uploadsDir = path.join(__dirname, 'uploads');
const videosDir = path.join(uploadsDir, 'videos');
const thumbsDir = path.join(uploadsDir, 'thumbs');
[uploadsDir, videosDir, thumbsDir].forEach((d) => { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }) });

// serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/videos', videos);
app.use('/api/videos/:id/comments', require('./routes/comments'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server listening on ${port}`));
