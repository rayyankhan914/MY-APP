const fs = require('fs')
const path = require('path')

const file = path.join(__dirname, 'videos.json')

// default seed data
const seed = [
  {
    id: '1',
    title: 'Flower (sample video)',
    description: 'Sample MP4 from MDN',
    url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    thumbnail: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.jpg',
    likes: 3,
    comments: [
      { id: 'c1', author: 'Alice', text: 'Nice demo!', createdAt: Date.now() - 100000 }
    ]
  },
  {
    id: '2',
    title: 'Big Buck Bunny (sample)',
    description: 'Open Movie Project sample',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
    likes: 7,
    comments: []
  },
  {
    id: '3',
    title: 'Elephants Dream',
    description: 'Elephants Dream (Blender Foundation)',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail: '/uploads/thumbs/elephants.svg',
    likes: 12,
    comments: []
  },
  {
    id: '4',
    title: 'Sintel (sample)',
    description: 'Sintel movie sample',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    thumbnail: '/uploads/thumbs/sintel.svg',
    likes: 9,
    comments: []
  },
  {
    id: '5',
    title: 'Tears of Steel',
    description: 'Tears of Steel (Blender Foundation)',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    thumbnail: '/uploads/thumbs/tears.svg',
    likes: 5,
    comments: []
  },
  {
    id: '6',
    title: 'For Bigger Joyrides',
    description: 'Sample for bigger joyrides',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    thumbnail: '/uploads/thumbs/joyrides.svg',
    likes: 4,
    comments: []
  },
  {
    id: '7',
    title: 'For Bigger Escapes',
    description: 'Sample for bigger escapes',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnail: '/uploads/thumbs/escapes.svg',
    likes: 2,
    comments: []
  },
  {
    id: '8',
    title: 'Subaru Outback On Street And Dirt',
    description: 'Car demo video sample',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    thumbnail: '/uploads/thumbs/subaru.svg',
    likes: 6,
    comments: []
  }
]

let videos = seed
try {
  if (fs.existsSync(file)) {
    const raw = fs.readFileSync(file, 'utf8')
    const parsed = JSON.parse(raw || 'null')
    if (Array.isArray(parsed)) videos = parsed
  }
} catch (err) {
  console.error('Failed to load videos.json', err.message)
}

function saveVideos() {
  try {
    fs.writeFileSync(file, JSON.stringify(videos, null, 2))
  } catch (err) {
    console.error('Failed to save videos.json', err.message)
  }
}

module.exports = { videos, saveVideos }
