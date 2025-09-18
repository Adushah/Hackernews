import React from 'react'
import { getList, getItem } from '../api/hn'
import StoryCard from './StoryCard.jsx'
import Loader from './Loader.jsx'

const PAGE_SIZE = 30

export default function StoryList({ kind, filter, bookmarks, onToggleBookmark }){
  const [ids, setIds] = React.useState(null)
  const [page, setPage] = React.useState(1)
  const [items, setItems] = React.useState([])
  const [loading, setLoading] = React.useState(false)

  React.useEffect(()=>{
    setIds(null); setItems([]); setPage(1)
    let alive = true
    getList(kind).then(list => { if(alive) setIds(list) })
    return ()=>{ alive = false }
  }, [kind])

  React.useEffect(()=>{
    if(!ids) return
    setLoading(true)
    const slice = ids.slice(0, page * PAGE_SIZE)
    Promise.all(slice.map(id => getItem(id))).then(data => {
      setItems(data.filter(Boolean))
      setLoading(false)
    })
  }, [ids, page])

  const filtered = filter
    ? items.filter(i => i.title && i.title.toLowerCase().includes(filter.toLowerCase()))
    : items

  return (
    <div className="list">
      {!ids && <Loader />}
      {filtered.map((it, i) => (
        <StoryCard key={it.id}
                   rank={i+1}
                   item={it}
                   isBookmarked={bookmarks.includes(String(it.id))}
                   onToggleBookmark={onToggleBookmark} />
      ))}
      {ids && filtered.length < ids.length && (
        <div style={{display:'grid', placeItems:'center', marginTop:10}}>
          <button className="btn" onClick={()=>setPage(p=>p+1)} disabled={loading}>
            {loading ? 'Loading…' : 'Load more'}
          </button>
        </div>
      )}
    </div>
  )
}
