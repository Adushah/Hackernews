import React from 'react'
import { login, register } from '../firebase/auth'

export default function Login({ onClose }){
  const [mode, setMode] = React.useState('login')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [err, setErr] = React.useState('')
  const [busy, setBusy] = React.useState(false)

  async function submit(e){
    e.preventDefault()
    setBusy(true); setErr('')
    try{
      if(mode==='login') await login(email, password)
      else await register(email, password)
      onClose && onClose()
    }catch(ex){
      let msg = ex?.message || 'Auth failed'
      if (ex?.code === 'auth/configuration-not-found') {
        msg = 'Error'
      }
      setErr(msg)
    }finally{
      setBusy(false)
    }
  }

  return (
    <div style={{
      position:'fixed', inset:0, background:'rgba(0,0,0,.5)',
      display:'grid', placeItems:'center', zIndex:100
    }}>
      <div style={{width:'min(560px, 92vw)'}} className="item">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <h2 style={{margin:0}}>{mode==='login' ? 'Login' : 'Create account'}</h2>
          <button className="btn ghost" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={submit} style={{marginTop:10}}>
          <div className="kv">
            <label className="key" htmlFor="email">Email</label>
            <input id="email" type="email" required value={email} onChange={e=>setEmail(e.target.value)}
                   style={{padding:'10px 12px', borderRadius:10, border:'1px solid #202634', background:'#0e1420', color:'white'}}/>
          </div>
          <div className="kv">
            <label className="key" htmlFor="password">Password</label>
            <input id="password" type="password" required value={password} onChange={e=>setPassword(e.target.value)}
                   style={{padding:'10px 12px', borderRadius:10, border:'1px solid #202634', background:'#0e1420', color:'white'}}/>
          </div>
          {err && <div style={{color:'#ef4444', marginTop:8}}>{err}</div>}
          <div style={{display:'flex', gap:10, marginTop:12}}>
            <button className="btn primary" type="submit" disabled={busy}>
              {busy ? 'Please wait…' : (mode==='login' ? 'Login' : 'Register')}
            </button>
            <button type="button" className="btn ghost" onClick={()=>setMode(m => m==='login'?'register':'login')}>
              {mode==='login' ? 'Create new account' : 'Have an account? Login'}
            </button>
          </div>
          
        </form>
      </div>
    </div>
  )
}
