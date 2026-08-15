import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { uploadVideo } from '../api'

export default function Upload() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [url, setUrl] = useState('')
  const [thumbnail, setThumbnail] = useState('')
  const [videoFile, setVideoFile] = useState(null)
  const [thumbnailFile, setThumbnailFile] = useState(null)
  const navigate = useNavigate()

  async function submit(e) {
    e.preventDefault()
    if (!title || !url) return alert('title and url required')
    const token = localStorage.getItem('token')
    if (!token) return alert('you must be logged in to upload')
    let v
    if (videoFile) {
      const fd = new FormData()
      fd.append('title', title)
      fd.append('description', description)
      fd.append('video', videoFile)
      if (thumbnailFile) fd.append('thumbnail', thumbnailFile)
      v = await uploadVideoForm(fd)
    } else {
      v = await uploadVideo({ title, description, url, thumbnail })
    }
    navigate(`/watch/${v.id}`)
  }

  return (
    <div className="container">
      <h2>Upload video (URL)</h2>
      <form onSubmit={submit} className="form">
        <label>Title<input value={title} onChange={(e)=>setTitle(e.target.value)} /></label>
        <label>Description<textarea value={description} onChange={(e)=>setDescription(e.target.value)} /></label>
        <label>Video file (optional)<input type="file" accept="video/*" onChange={(e)=>setVideoFile(e.target.files[0]||null)} /></label>
        <label>Or video URL<input value={url} onChange={(e)=>setUrl(e.target.value)} /></label>
        <label>Thumbnail file (optional)<input type="file" accept="image/*" onChange={(e)=>setThumbnailFile(e.target.files[0]||null)} /></label>
        <label>Or thumbnail URL<input value={thumbnail} onChange={(e)=>setThumbnail(e.target.value)} /></label>
        <button type="submit">Upload</button>
      </form>
    </div>
  )
}
