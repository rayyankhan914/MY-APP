import React from 'react'
import { Link } from 'react-router-dom'
import { useSearch } from '../search/SearchContext'

export default function Home() {
  const { results: videos, loading, query } = useSearch()

  return (
    <div className="container">
      <h2>Latest videos</h2>
      {query && <div style={{marginBottom:8,color:'#555'}}>Showing results for "{query}" {loading && '(loading...)'}</div>}
      <div className="grid">
        {loading && videos.length === 0 ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div className="card skeleton" key={i} style={{position:'relative'}}>
              <div className="skeleton-thumb" />
              <div style={{display:'flex',flexDirection:'column',justifyContent:'space-between',flex:1,paddingLeft:12}}>
                <div style={{display:'flex',alignItems:'center'}}>
                  <div className="skeleton-avatar" />
                  <div className="skeleton-lines" style={{flex:1,marginLeft:10}}>
                    <div className="skeleton-line short" />
                    <div className="skeleton-line" />
                  </div>
                </div>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div className="skeleton-line" style={{width:120,height:10}} />
                  <div className="skeleton-duration" style={{width:48,height:14,background:'#ddd',borderRadius:4}} />
                </div>
              </div>
            </div>
          ))
        ) : (
          videos.map((v) => (
            <Link to={`/watch/${v.id}`} key={v.id} className="card">
              {v.thumbnail ? <img src={v.thumbnail} alt="thumb" className="card-thumb" /> : <div className="thumb">▶</div>}
              <div className="meta">
                <div className="title">{v.title}</div>
                <div className="desc">{v.description}</div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
