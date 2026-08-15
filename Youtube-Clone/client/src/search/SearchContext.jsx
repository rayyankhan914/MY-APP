import React from 'react'
import { fetchVideos } from '../api'

const SearchContext = React.createContext(null)

export function SearchProvider({ children, debounceMs = 200 }) {
  const [query, setQuery] = React.useState('')
  const [results, setResults] = React.useState([])
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    let cancelled = false
    setLoading(true)
    const id = setTimeout(async () => {
      try {
        const res = await fetchVideos(query)
        if (cancelled) return
        setResults(res)
      } catch (err) {
        if (cancelled) return
        setResults([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }, debounceMs)
    return () => { cancelled = true; clearTimeout(id) }
  }, [query, debounceMs])

  return (
    <SearchContext.Provider value={{ query, setQuery, results, loading }}>
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const ctx = React.useContext(SearchContext)
  if (!ctx) throw new Error('useSearch must be used within SearchProvider')
  return ctx
}

export default SearchContext
