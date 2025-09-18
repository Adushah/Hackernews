import React from 'react'
import { getUser, getItem } from '../api/hn'
import { timeAgo } from '../utils/time'
import StoryCard from './StoryCard.jsx'

export default function UserPage({ id, bookmarks, onToggleBookmark }){
  const [data, setData] = React.useState(null)
  const [subs, setSubs] = React.useState([])

  React.useEffect(()=>{
    let alive = true
    getUser(id).then(u => { 
      if(!alive) return
      setData(u)
      if(u && Array.isArray(u.submitted)){
        const first = u.submitted.slice(0, 20)
        Promise.all(first.map(i => getItem(i))).then(s => setSubs(s.filter(Boolean)))
      }
    })
    return ()=>{ alive=false }
  }, [id])

  if(!data) return <div className="loader">Loading user…</div>

  return (
    <div>
      <div className="user-card">
        <h2 style={{margin:'0 0 6px'}}>User: {data.id}</h2>
        <div className="kv"><div className="key">Karma</div><div>{data.karma}</div></div>
        <div className="kv"><div className="key">Created</div><div>{timeAgo(data.created)}</div></div>
        {data.about && (
          <div className="kv"><div className="key">About</div>
            <div dangerouslySetInnerHTML={{__html:data.about}} />
          </div>
        )}
      </div>
      <div className="list">
        {subs.map((it, i)=> (
          <StoryCard key={it.id}
                     rank={i+1}
                     item={it}
                     isBookmarked={bookmarks.includes(String(it.id))}
                     onToggleBookmark={onToggleBookmark} />
        ))}
      </div>
    </div>
  )
}
