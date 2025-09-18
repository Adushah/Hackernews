import React from 'react'
import { timeAgo, hostname } from '../utils/time'
import { nav } from '../utils/router'

export default function StoryCard({ rank, item, isBookmarked, onToggleBookmark }){
  if(!item) return null
  const isJob = item.type === 'job'
  return (
    <div className="card">
      <div className="rank">{rank}</div>
      <div>
        <h3>
          {item.url ? (
            <a className="title" href={item.url} target="_blank" rel="noreferrer">{item.title}</a>
          ) : (
            <a className="title" href={"#/item/"+item.id}>{item.title}</a>
          )}
        </h3>
        <div className="meta">
          {!isJob && <div className="badge">▲ {item.score}</div>}
          {item.by && <div className="badge" style={{cursor:'pointer'}}
                         onClick={()=>nav('user/'+item.by)}>by {item.by}</div>}
          <div className="badge">{timeAgo(item.time)}</div>
          {item.descendants != null && !isJob && (
            <div className="badge" style={{cursor:'pointer'}}
                 onClick={()=>nav('item/'+item.id)}>
              💬 {item.descendants}
            </div>
          )}
          {item.url && <div className="badge">{hostname(item.url)}</div>}
        </div>
      </div>
      <div>
        <button className="btn ghost" onClick={()=>onToggleBookmark(item.id)}>
          {isBookmarked ? '★ Saved' : '☆ Save'}
        </button>
      </div>
    </div>
  )
}
