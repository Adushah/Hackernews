import React from 'react'
import { getItem, getMaxItem } from '../api/hn'
import { timeAgo } from '../utils/time'
import { nav } from '../utils/router'
import Loader from './Loader.jsx'

const PAGE_SIZE = 30
const BATCH = 120

function stripHTML(html=''){
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

function CommentFeedRow({ comment }){
  const [parent, setParent] = React.useState(null)
  React.useEffect(()=>{
    let alive = true
    if(comment.parent){
      getItem(comment.parent).then(p => { if(alive) setParent(p) })
    }
    return ()=>{ alive = false }
  }, [comment.parent])

  const text = stripHTML(comment.text || '').slice(0, 240)
  return (
    <div className="card">
      <div className="rank">💬</div>
      <div>
        <h3 style={{margin:0,fontSize:16}}>
          <a className="title" href={`#/item/${comment.parent || comment.id}`}>{text || '(no text)'}</a>
        </h3>
        <div className="meta">
          {comment.by && <div className="badge" style={{cursor:'pointer'}} onClick={()=>nav('user/'+comment.by)}>by {comment.by}</div>}
          <div className="badge">{timeAgo(comment.time)}</div>
          {parent && parent.title && <div className="badge" style={{cursor:'pointer'}} onClick={()=>nav('item/'+(comment.parent || comment.id))}>
            on: {parent.title.slice(0, 50)}{parent.title.length>50?'…':''}
          </div>}
        </div>
      </div>
      <div>
        <a className="btn ghost" href={`#/item/${comment.parent || comment.id}`}>Context →</a>
      </div>
    </div>
  )
}

export default function CommentsList(){
  const [cursor, setCursor] = React.useState(null)
  const [items, setItems] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')

  React.useEffect(()=>{
    let alive = true
    getMaxItem().then(id => { if(alive){ setCursor(id) }}).catch(e => setError(String(e)))
    return ()=>{ alive = false }
  }, [])

  async function loadMore(){
    if(loading || cursor == null) return
    setLoading(true)
    try{
      let acc = []
      let cur = cursor
      while(acc.length < PAGE_SIZE && cur > 0){
        const start = cur
        const end = Math.max(1, cur - BATCH + 1)
        const ids = []
        for(let i=start; i>=end; i--) ids.push(i)
        const batch = await Promise.all(ids.map(id => getItem(id)))
        const comments = batch.filter(x => x && x.type === 'comment' && !x.dead && !x.deleted)
        acc = acc.concat(comments)
        cur = end - 1
      }
      setItems(prev => prev.concat(acc.slice(0, PAGE_SIZE)))
      setCursor(cur)
    } catch(e){
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(()=>{
    if(cursor != null && items.length === 0 && !loading){
      loadMore()
    }

  }, [cursor])

  if(error) return <div className="loader">Error: {error}</div>
  if(cursor == null && items.length === 0) return <Loader />

  return (
    <div className="list">
      {items.map((c) => <CommentFeedRow key={c.id} comment={c} />)}
      <div style={{display:'grid', placeItems:'center', marginTop:10}}>
        <button className="btn" onClick={loadMore} disabled={loading || cursor <= 1}>
          {loading ? 'Loading…' : 'Load more'}
        </button>
      </div>
    </div>
  )
}
