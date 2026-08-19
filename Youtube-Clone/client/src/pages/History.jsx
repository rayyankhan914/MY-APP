import React from 'react'
import api from '../api'
import { Link } from 'react-router-dom'

export default function History() {
  const [history, setHistory] = React.useState([])
  const [offset, setOffset] = React.useState(0)
  const [limit] = React.useState(20)
  const [total, setTotal] = React.useState(0)
  const [loadingMore, setLoadingMore] = React.useState(false)

  React.useEffect(() => {
    let mounted = true
    api.fetchHistory().then((res) => {
      if (!mounted) return
      setHistory(res.items || [])
      setOffset(res.offset || 0)
      setTotal(res.total || 0)
    }).catch(() => {})
    return () => { mounted = false }
  }, [])

  async function handleClear() {
    if (!confirm('Clear your watch history?')) return
    try {
      await api.clearHistory()
      setHistory([])
    } catch (err) {
      console.error('clear history failed', err)
      alert('Failed to clear history')
    }
  }

  async function loadMore() {
    if (loadingMore) return
    setLoadingMore(true)
    try {
      const next = await api.fetchHistoryPage(offset + limit, limit)
      setHistory((s) => [...s, ...next.items])
      setOffset(next.offset)
      setTotal(next.total)
    } catch (err) {
      console.error('load more failed', err)
    } finally {
      setLoadingMore(false)
    }
  }

  // undo support for recent removal
  const [recentlyRemoved, setRecentlyRemoved] = React.useState(null)
  React.useEffect(() => {
    if (!recentlyRemoved) return
    const t = setTimeout(() => setRecentlyRemoved(null), 5000)
    return () => clearTimeout(t)
  }, [recentlyRemoved])

  return (
    <div className="container">
      <h2>Watch history</h2>
      <p className="muted">Items you watched recently.</p>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div className="muted">Items you watched recently.</div>
        <div><button onClick={handleClear} className="danger">Clear history</button></div>
      </div>
      <div className="grid" style={{marginTop:12}}>
        {history.length === 0 && <div className="card">No history yet.</div>}
        {history.map((v) => (
          <div className="card" key={v.id} style={{position:'relative'}}>
            <Link to={`/watch/${v.id}`} style={{display:'flex',gap:12,alignItems:'center',textDecoration:'none',color:'inherit'}}>
              <img src={v.thumbnail || '/logo192.png'} className="card-thumb" alt="thumb" />
              <div className="meta">
                <div className="title">{v.title}</div>
                <div className="muted">Watched {new Date(v.watchedAt).toLocaleString()}</div>
              </div>
            </Link>
            <button className="tiny" style={{position:'absolute',right:8,top:8}} onClick={async (e) => {
              e.preventDefault(); e.stopPropagation();
              if (!confirm('Remove this item from history?')) return
              try {
                await api.deleteHistoryItem(v.id)
                setHistory((s) => s.filter((x) => x.id !== v.id))
                setRecentlyRemoved({ id: v.id, item: v })
              } catch (err) {
                console.error('delete history item failed', err)
                alert('Failed to remove item')
              }
            }}>Remove</button>
          </div>
        ))}
      </div>
      {offset + history.length < total && (
        <div style={{textAlign:'center',marginTop:12}}>
          <button onClick={loadMore} disabled={loadingMore}>{loadingMore ? 'Loading…' : 'Load more'}</button>
        </div>
      )}
      {recentlyRemoved && (
        <div style={{position:'fixed',right:20,bottom:20,background:'#222',color:'#fff',padding:12,borderRadius:6,display:'flex',gap:12,alignItems:'center'}}>
          <div>Removed <strong>{recentlyRemoved.item.title}</strong></div>
          <div>
            <button onClick={async () => {
              try {
                await api.addHistoryItem(recentlyRemoved.id, recentlyRemoved.item.watchedAt)
                setHistory((s) => [recentlyRemoved.item, ...s])
                setRecentlyRemoved(null)
              } catch (err) {
                console.error('undo failed', err)
                alert('Failed to restore')
              }
            }}>Undo</button>
          </div>
        </div>
      )}
    </div>
  )
}
