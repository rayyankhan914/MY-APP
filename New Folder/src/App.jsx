import { useMemo, useState } from 'react'
import './App.css'

const videos = [
  {
    id: 1,
    title: 'Neon Nights: a cinematic study mix',
    channel: 'Lumen Lab',
    views: '2.1M views',
    duration: '14:20',
    category: 'Music',
    description: 'Soft synths, midnight city lights, and a hypnotic loop to keep the focus flowing.',
    image:
      'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 2,
    title: 'AI tools for the next creative sprint',
    channel: 'Northstar Studio',
    views: '860K views',
    duration: '09:42',
    category: 'AI',
    description: 'A quick workflow for turning raw ideas into polished visuals in one afternoon.',
    image:
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 3,
    title: 'Cozy setup tour with ambient coding vibes',
    channel: 'Quiet Circuit',
    views: '1.3M views',
    duration: '11:08',
    category: 'Focus',
    description: 'Warm lights, layered audio, and a compact desk that feels like a calm retreat.',
    image:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 4,
    title: 'Pixel-perfect game dev diary',
    channel: 'Ink & Code',
    views: '540K views',
    duration: '07:16',
    category: 'Gaming',
    description: 'An intimate look at how one indie team shapes movement, pacing, and mood.',
    image:
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 5,
    title: 'Visual storytelling in under 60 seconds',
    channel: 'Frame Drift',
    views: '412K views',
    duration: '05:50',
    category: 'Design',
    description: 'Learn how to build emotion, rhythm, and contrast into a punchy reel.',
    image:
      'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 6,
    title: 'Night mode editing on a laptop',
    channel: 'Velvet Cut',
    views: '970K views',
    duration: '13:05',
    category: 'Music',
    description: 'A cinematic approach to edits that feels immersive even on a small screen.',
    image:
      'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80',
  },
]

const categories = ['All', 'AI', 'Music', 'Gaming', 'Design', 'Focus']

function App() {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const filteredVideos = useMemo(() => {
    return videos.filter((video) => {
      const matchesCategory = activeCategory === 'All' || video.category === activeCategory
      const matchesQuery = `${video.title} ${video.channel} ${video.description}`
        .toLowerCase()
        .includes(query.toLowerCase())

      return matchesCategory && matchesQuery
    })
  }, [activeCategory, query])

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-block">
          <div className="brand-icon">▶</div>
          <div>
            <p className="brand-eyebrow">Vivid Stream</p>
            <h1>Discover the next obsession</h1>
          </div>
        </div>

        <div className="search-pill">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search a mood, creator, or topic"
          />
          <button type="button">Search</button>
        </div>
      </header>

      <div className="layout-grid">
        <aside className="sidebar">
          <div className="sidebar-card accent-card">
            <p className="eyebrow">Live now</p>
            <h2>Night Pulse Session</h2>
            <p>Studio drops, ambient loops, and a room full of tomorrow’s creators.</p>
          </div>

          <div className="sidebar-card">
            <h3>Curator picks</h3>
            <ul>
              <li>Fresh edits</li>
              <li>Atmospheric study</li>
              <li>Design systems</li>
            </ul>
          </div>
        </aside>

        <main className="main-content">
          <section className="hero-card">
            <div>
              <p className="eyebrow">Featured collection</p>
              <h2>Built for late-night inspiration.</h2>
              <p>
                A bold, cinematic space for discovering mood-driven videos that feel as good as they look.
              </p>
              <div className="hero-actions">
                <button type="button">Watch now</button>
                <button type="button" className="secondary-btn">
                  Explore moodboards
                </button>
              </div>
            </div>
            <div className="hero-visual" aria-hidden="true">
              <div className="orb" />
              <div className="hero-stat">
                <strong>24K+</strong>
                <span>watchers online</span>
              </div>
            </div>
          </section>

          <section className="chip-row" aria-label="Video categories">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`chip ${activeCategory === category ? 'active' : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </section>

          <section className="videos-section">
            <div className="section-header">
              <div>
                <p className="eyebrow">Trending picks</p>
                <h3>{filteredVideos.length} standout videos</h3>
              </div>
              <p className="muted-text">Filtered by your current mood and search.</p>
            </div>

            <div className="video-grid">
              {filteredVideos.map((video) => (
                <article className="video-card" key={video.id}>
                  <img src={video.image} alt={video.title} />
                  <div className="video-body">
                    <div className="video-meta">
                      <span>{video.category}</span>
                      <span>{video.duration}</span>
                    </div>
                    <h4>{video.title}</h4>
                    <p>{video.description}</p>
                    <div className="video-footer">
                      <div>
                        <strong>{video.channel}</strong>
                        <span>{video.views}</span>
                      </div>
                      <button type="button">Play</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {filteredVideos.length === 0 && (
              <div className="empty-state">Nothing matched that search yet. Try another mood.</div>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}

export default App
