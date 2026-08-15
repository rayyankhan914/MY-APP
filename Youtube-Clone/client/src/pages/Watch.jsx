import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchVideo, likeVideo, fetchComments, postComment } from '../api'

export default function Watch() {
  const { id } = useParams()
  const [video, setVideo] = useState(null)
  const [comments, setComments] = useState([])
  const [text, setText] = useState('')

  useEffect(() => {
    fetchVideo(id).then(setVideo).catch(() => setVideo(null))
    fetchComments(id).then(setComments).catch(()=>setComments([]))
  }, [id])

  if (!video) return <div className="container">Video not found</div>

  async function handleLike() {
    const res = await likeVideo(id)
    setVideo((v) => ({ ...v, likes: res.likes }))
  }

  async function submitComment(e) {
    e.preventDefault()
    const token = localStorage.getItem('token')
    if (!token) return alert('login to comment')
    if (!text) return
    const c = await postComment(id, { text })
    setComments((s) => [...s, c])
    setText('')
  }

  return (
    <div className="container">
      <h2>{video.title}</h2>
      <video controls className="player">
        <source src={video.url} type="video/mp4" />
      </video>
      <div style={{display:'flex',gap:12,alignItems:'center',marginTop:8}}>
        <button onClick={handleLike}>👍 Like ({video.likes || 0})</button>
      </div>
      <p>{video.description}</p>

      <section style={{marginTop:20}}>
        <h3>Comments</h3>
        <div>
          {comments.map((c) => (
            <div key={c.id} style={{padding:8,background:'#fff',marginBottom:8,borderRadius:6}}>
              <div style={{fontWeight:600}}>{c.author}</div>
              <div>{c.text}</div>
            </div>
          ))}
        </div>
        <form onSubmit={submitComment} style={{marginTop:8}}>
          <textarea value={text} onChange={(e)=>setText(e.target.value)} style={{width:'100%',padding:8}} placeholder="Add a public comment" />
          <div style={{marginTop:6}}>
            <button type="submit">Comment</button>
          </div>
        </form>
      </section>
    </div>
  )
}
