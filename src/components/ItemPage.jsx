import React from 'react'
import { getItem } from '../api/hn'
import { timeAgo, hostname } from '../utils/time'
import Comment from './Comment.jsx'

export default function ItemPage({ id, onToggleBookmark, isBookmarked }){
  const [data, setData] = React.useState(null)

  React.useEffect(()=>{
    let alive = true
    getItem(id).then(d => { if(alive) setData(d) })
    return ()=>{ alive=false }
  }, [id])

  if(!data) return <div className="loader">Loading story…</div>

  const isJob = data.type === 'job'

  return (
    <div className="item">
      <h1 className="title">{data.title}</h1>
      <div className="source">
        {data.url ? <a href={data.url} target="_blank" rel="noreferrer">{hostname(data.url)}</a> : 'self'}
        {' • '}
        {!isJob && <span>▲ {data.score}</span>}
        {' • '}
        <span>by {data.by}</span>
        {' • '}
        <span>{timeAgo(data.time)}</span>
      </div>

      {data.text && <div className="text" dangerouslySetInnerHTML={{__html:data.text}} />}

      <div className="actions">
        <a className="btn" href={`#/`}>&larr; Back</a>
        {onToggleBookmark && <button className="btn ghost" onClick={()=>onToggleBookmark(data.id)}>
          {isBookmarked ? '★ Saved' : '☆ Save'}
        </button>}
        {data.url && <a className="btn primary" href={data.url} target="_blank" rel="noreferrer">Open link</a>}
      </div>

      {!isJob && (
        <div className="comments">
          <h3 style={{margin:'6px 0 12px'}}>Comments ({data.descendants ?? 0})</h3>
          {data.kids ? data.kids.map(cid => <Comment key={cid} id={cid} />) : <div className="loader">No comments</div>}
        </div>
      )}
    </div>
  )
}
