import React from 'react'
import { fetchUserProfile } from '../api'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const [data, setData] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(null)

  const navigate = useNavigate()

  React.useEffect(() => {
    let mounted = true
    setLoading(true)
    fetchUserProfile()
      .then((res) => { if (mounted) setData(res) })
      .catch((err) => {
        if (!mounted) return
        if (err && err.response && err.response.status === 401) {
          // not authenticated — redirect to login
          navigate('/login')
          return
        }
        setError(err.response ? err.response.data : err.message)
      })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  if (loading) return <div className="page"><h2>Profile</h2><p>Loading...</p></div>
  if (error) return <div className="page"><h2>Profile</h2><p>Error: {JSON.stringify(error)}</p></div>

  return (
    <div className="page">
      <h2>Profile — {data.user.username}</h2>
      <section>
        <h3>Your uploads</h3>
        {data.videos.length === 0 ? (
          <p>No uploads yet.</p>
        ) : (
          <div className="grid">
            {data.videos.map((v) => (
              <div key={v.id} className="card">
                <a href={`/watch/${v.id}`}>
                  <img src={v.thumbnail} alt={v.title} style={{ width: '100%' }} />
                </a>
                <div className="card-body">
                  <h4>{v.title}</h4>
                  <p className="muted">{v.likes || 0} likes</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
