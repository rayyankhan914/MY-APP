import React from 'react'
import { fetchUserProfile } from '../api'
import { updateUserProfile } from '../api'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const [data, setData] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(null)
  const [editing, setEditing] = React.useState(false)
  const [about, setAbout] = React.useState('')
  const [avatarFile, setAvatarFile] = React.useState(null)
  const [coverFile, setCoverFile] = React.useState(null)

  const navigate = useNavigate()

  React.useEffect(() => {
    let mounted = true
    setLoading(true)
    fetchUserProfile()
      .then((res) => { if (mounted) {
        setData(res)
        setAbout(res.user?.about || '')
      } })
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

  async function onEditSubmit(e) {
    e.preventDefault()
    const fd = new FormData()
    fd.append('about', about)
    if (avatarFile) fd.append('avatar', avatarFile)
    if (coverFile) fd.append('cover', coverFile)
    try {
      const res = await updateUserProfile(fd)
      setData({ ...data, user: res.user })
      setEditing(false)
    } catch (err) {
      alert(err.response?.data?.error || 'Update failed')
    }
  }

  if (loading) return <div className="page"><h2>Profile</h2><p>Loading...</p></div>
  if (error) return (
    <div className="page">
      <h2>Profile</h2>
      <p>Error: {JSON.stringify(error)}</p>
      <div style={{ marginTop: 12 }}>
        <button onClick={() => window.location.reload()}>Retry</button>
        <button style={{ marginLeft: 8 }} onClick={() => window.location.href = '/login'}>Login</button>
      </div>
    </div>
  )

  if (!data || !data.user) return (
    <div className="page">
      <h2>Profile</h2>
      <p>No user data returned from server. Try logging in again.</p>
      <div style={{ marginTop: 12 }}>
        <button onClick={() => window.location.href = '/login'}>Login</button>
      </div>
    </div>
  )

  return (
    <div className="page">
      <div style={{ marginBottom: 12 }}>
        {data.user.cover ? <img src={data.user.cover} alt="cover" style={{ width: '100%', maxHeight: 200, objectFit: 'cover' }} /> : <div style={{ width: '100%', height: 160, background: '#eee' }} />}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 96, height: 96 }}>
          {data.user.avatar ? <img src={data.user.avatar} alt="avatar" style={{ width: 96, height: 96, borderRadius: 8, objectFit: 'cover' }} /> : <div style={{ width: 96, height: 96, background: '#ddd', borderRadius: 8 }} />}
        </div>
        <h2>Profile — {data.user.username}</h2>
      </div>
      {data.user.about && <p style={{ marginTop: 8 }}>{data.user.about}</p>}
      <section>
        <h3>Your uploads</h3>
        <div style={{ marginTop: 8 }}>
          <button onClick={() => setEditing(true)}>Edit profile</button>
        </div>
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
      {editing && (
        <div style={{ marginTop: 16 }}>
          <h3>Edit profile</h3>
          <form onSubmit={onEditSubmit}>
            <div>
              <label>About</label>
              <br />
              <textarea value={about} onChange={(e)=>setAbout(e.target.value)} rows={4} style={{ width: '100%' }} />
            </div>
            <div style={{ marginTop: 8 }}>
              <label>Avatar</label>
              <input type="file" accept="image/*" onChange={(e)=>setAvatarFile(e.target.files && e.target.files[0])} />
            </div>
            <div style={{ marginTop: 8 }}>
              <label>Cover</label>
              <input type="file" accept="image/*" onChange={(e)=>setCoverFile(e.target.files && e.target.files[0])} />
            </div>
            <div style={{ marginTop: 12 }}>
              <button type="submit">Save</button>
              <button type="button" style={{ marginLeft: 8 }} onClick={()=>setEditing(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
