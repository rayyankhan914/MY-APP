import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { uploadVideo, uploadVideoForm } from '../api'

export default function Upload() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [url, setUrl] = useState('')
  const [thumbnail, setThumbnail] = useState('')
  const [videoFile, setVideoFile] = useState(null)
  const [thumbnailFile, setThumbnailFile] = useState(null)
  const [previewThumb, setPreviewThumb] = useState(null)
  const [progress, setProgress] = useState(0)
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
      setProgress(0)
      v = await uploadVideoForm(fd, (p) => setProgress(p))
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
        <label>Thumbnail file (optional)<input type="file" accept="image/*" onChange={(e)=>{ const f=e.target.files[0]||null; setThumbnailFile(f); setPreviewThumb(f ? URL.createObjectURL(f) : null) }} /></label>
        <label>Or thumbnail URL<input value={thumbnail} onChange={(e)=>setThumbnail(e.target.value)} /></label>
        {previewThumb && <div style={{marginTop:8}}><img src={previewThumb} alt="thumb preview" style={{maxWidth:160}}/></div>}
        {progress>0 && progress<100 && (
          <div style={{marginTop:8}}>
            <div style={{width: '100%', background:'#eee', borderRadius:4, overflow:'hidden'}}>
              <div style={{width: `${progress}%`, height:8, background:'#06f'}} />
            </div>
            <div style={{fontSize:12,marginTop:4}}>{progress}%</div>
          </div>
        )}
        <button type="submit">Upload</button>
      </form>
    </div>
  )
}
