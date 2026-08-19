import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:4000/api' })

export function setAuthToken(token) {
  if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  else delete api.defaults.headers.common['Authorization']
}

// initialize from localStorage if present
if (typeof window !== 'undefined') {
  const t = localStorage.getItem('token')
  if (t) setAuthToken(t)
}

export async function fetchVideos(q) {
  const url = q ? `/videos?q=${encodeURIComponent(q)}` : '/videos'
  const res = await api.get(url)
  // ensure local upload paths are absolute to backend so Vite doesn't try to serve them
  const base = api.defaults.baseURL.replace(/\/api$/, '')
  const data = Array.isArray(res.data)
    ? res.data.map((v) => ({ ...v, thumbnail: v.thumbnail && v.thumbnail.startsWith('/uploads') ? base + v.thumbnail : v.thumbnail }))
    : res.data
  return data
}

export async function fetchVideo(id) {
  const res = await api.get(`/videos/${id}`)
  const base = api.defaults.baseURL.replace(/\/api$/, '')
  const v = res.data
  if (v && v.thumbnail && v.thumbnail.startsWith('/uploads')) v.thumbnail = base + v.thumbnail
  return v
}

export async function uploadVideo(payload) {
  const res = await api.post('/videos', payload)
  return res.data
}

export async function uploadVideoForm(formData, onProgress) {
  const res = await api.post('/videos/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => {
      if (onProgress && e.lengthComputable !== false) {
        onProgress(Math.round((e.loaded * 100) / (e.total || 1)))
      }
    }
  })
  return res.data
}

// convenience wrapper to POST with axios instance
api.post = api.post.bind(api)

export async function likeVideo(id) {
  const res = await api.post(`/videos/${id}/like`)
  return res.data
}

export async function fetchComments(videoId) {
  const res = await api.get(`/videos/${videoId}/comments`)
  return res.data
}

export async function postComment(videoId, payload) {
  const res = await api.post(`/videos/${videoId}/comments`, payload)
  return res.data
}

export async function fetchUserProfile() {
  const res = await api.get('/users/me')
  const base = api.defaults.baseURL.replace(/\/api$/, '')
  const d = res.data
  if (d && Array.isArray(d.videos)) {
    d.videos = d.videos.map((v) => ({ ...v, thumbnail: v.thumbnail && v.thumbnail.startsWith('/uploads') ? base + v.thumbnail : v.thumbnail }))
  }
  if (d && d.user) {
    if (d.user.avatar && d.user.avatar.startsWith('/uploads')) d.user.avatar = base + d.user.avatar
    if (d.user.cover && d.user.cover.startsWith('/uploads')) d.user.cover = base + d.user.cover
  }
  return d
}

export async function fetchHistory() {
  const res = await api.get('/users/history', { params: { offset: 0, limit: 20 } })
  const base = api.defaults.baseURL.replace(/\/api$/, '')
  const items = Array.isArray(res.data.items) ? res.data.items.map((v) => ({ ...v, thumbnail: v.thumbnail && v.thumbnail.startsWith('/uploads') ? base + v.thumbnail : v.thumbnail })) : []
  return { items, total: res.data.total, offset: res.data.offset, limit: res.data.limit }
}

export async function fetchHistoryPage(offset = 0, limit = 20) {
  const res = await api.get('/users/history', { params: { offset, limit } })
  const base = api.defaults.baseURL.replace(/\/api$/, '')
  const items = Array.isArray(res.data.items) ? res.data.items.map((v) => ({ ...v, thumbnail: v.thumbnail && v.thumbnail.startsWith('/uploads') ? base + v.thumbnail : v.thumbnail })) : []
  return { items, total: res.data.total, offset: res.data.offset, limit: res.data.limit }
}

export async function clearHistory() {
  const res = await api.delete('/users/history')
  return res.data
}

export async function deleteHistoryItem(videoId) {
  const res = await api.delete(`/users/history/${encodeURIComponent(videoId)}`)
  return res.data
}

export async function addHistoryItem(videoId, watchedAt) {
  const res = await api.post('/users/history', { videoId, watchedAt })
  return res.data
}

export async function updateUserProfile(formData) {
  const res = await api.post('/users/me', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return res.data
}

export default api
