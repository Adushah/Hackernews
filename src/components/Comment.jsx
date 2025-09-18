import React from 'react'
import { getItem } from '../api/hn'
import { timeAgo } from '../utils/time'

export default function Comment({ id, depth=0 }){
  const [data, setData] = React.useState(null)
  const [open, setOpen] = React.useState(true)

  React.useEffect(()=>{
    let alive = true
    getItem(id).then(d => { if(alive) setData(d) })
    return ()=>{ alive=false }
  }, [id])

  if(!data || data.deleted || data.dead) return null

  return (
    <div className="comment" style={{marginLeft: depth * 12}}>
      <div className="header">
        <b>{data.by}</b> • {timeAgo(data.time)} {data.kids && data.kids.length>0 && (
          <span className="toggle" onClick={()=>setOpen(o=>!o)}>
            {open ? ' [–] ' : ` [+ ${data.kids.length} replies] `}
          </span>
        )}
      </div>
      <div className="body" dangerouslySetInnerHTML={{__html:data.text || ''}} />
      {open && data.kids && data.kids.map(cid => (
        <Comment key={cid} id={cid} depth={depth+1} />
      ))}
    </div>
  )
}
