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
  return res.data
}

export async function fetchVideo(id) {
  const res = await api.get(`/videos/${id}`)
  return res.data
}

export async function uploadVideo(payload) {
  const res = await api.post('/videos', payload)
  return res.data
}

export async function uploadVideoForm(formData) {
  const res = await api.post('/videos/upload', formData)
  return res.data
}

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
  return res.data
}

export default api
