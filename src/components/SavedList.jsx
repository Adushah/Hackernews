import React from 'react'
import { getItem } from '../api/hn'
import StoryCard from './StoryCard.jsx'
import Loader from './Loader.jsx'

export default function SavedList({ ids, bookmarks, onToggleBookmark, filter }){
  const [items, setItems] = React.useState(null)

  React.useEffect(()=>{
    let alive = true
    Promise.all(ids.map(id => getItem(id))).then(it => {
      if(alive) setItems(it.filter(Boolean))
    })
    return ()=>{ alive=false }
  }, [ids.join(',')])

  if(!items) return <Loader />

  const filtered = filter
    ? items.filter(i => i.title && i.title.toLowerCase().includes(filter.toLowerCase()))
    : items

  return (
    <div className="list">
      {filtered.map((it, i) => (
        <StoryCard key={it.id}
                   rank={i+1}
                   item={it}
                   isBookmarked={bookmarks.includes(String(it.id))}
                   onToggleBookmark={onToggleBookmark} />
      ))}
    </div>
  )
}
