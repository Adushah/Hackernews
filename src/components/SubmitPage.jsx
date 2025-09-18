import React from 'react'
import { addSubmission, fetchMySubmissions } from '../store/submissions'
import { timeAgo } from '../utils/time'

export default function SubmitPage({ user }){
  const [title, setTitle] = React.useState('')
  const [url, setUrl] = React.useState('')
  const [text, setText] = React.useState('')
  const [busy, setBusy] = React.useState(false)
  const [err, setErr] = React.useState('')
  const [ok, setOk] = React.useState('')
  const [mine, setMine] = React.useState([])

  async function loadMine(){
    const rows = await fetchMySubmissions(user?.uid || null)
    setMine(rows)
  }

  React.useEffect(()=>{
    loadMine()
   
  }, [user?.uid])

  async function submit(e){
    e.preventDefault()
    setErr(''); setOk(''); setBusy(true)
    try{
      if(!title.trim()) throw new Error('Title is required')
      if(!url.trim() && !text.trim()) throw new Error('Either URL or Text is required')
      await addSubmission(user?.uid || null, { title, url, text })
      setOk('Submitted!')
      setTitle(''); setUrl(''); setText('')
      loadMine()
    }catch(ex){
      setErr(ex.message || String(ex))
    }finally{
      setBusy(false)
    }
  }

  return (
    <div className="item">
      <h2 style={{marginTop:0}}>Submit</h2>
      <form onSubmit={submit}>
        <div className="kv">
          <label className="key">Title *</label>
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Awesome article..." 
                 style={{padding:'10px 12px', borderRadius:10, border:'1px solid #202634', background:'#0e1420', color:'white'}} />
        </div>
        <div className="kv">
          <label className="key">URL</label>
          <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://example.com/post"
                 style={{padding:'10px 12px', borderRadius:10, border:'1px solid #202634', background:'#0e1420', color:'white'}} />
        </div>
        <div className="kv">
          <label className="key">Text</label>
          <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Optional text..."
                    rows={5}
                    style={{padding:'10px 12px', width:'100%', borderRadius:10, border:'1px solid #202634', background:'#0e1420', color:'white'}} />
        </div>
        {err && <div style={{color:'#ef4444', marginTop:8}}>{err}</div>}
        {ok && <div style={{color:'#34d399', marginTop:8}}>{ok}</div>}
        <div style={{display:'flex', gap:10, marginTop:12}}>
          <button className="btn primary" type="submit" disabled={busy}>{busy ? 'Submitting…' : 'Submit'}</button>
        </div>
      </form>

      <h3 style={{marginTop:24}}>My submissions</h3>
      <div className="list">
        {mine.length === 0 && <div className="loader">No submissions yet.</div>}
        {mine.map((s, i)=> (
          <div className="card" key={i}>
            <div className="rank">✚</div>
            <div>
              <h3 style={{margin:0}}>
                {s.url ? <a className="title" href={s.url} target="_blank" rel="noreferrer">{s.title}</a> : s.title}
              </h3>
              <div className="meta">
                <div className="badge">{timeAgo(Math.floor((s.createdAt || Date.now())/1000))}</div>
                {s.url && <div className="badge">link</div>}
                {s.text && <div className="badge">text</div>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
