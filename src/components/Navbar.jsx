import React from 'react'
import { nav } from '../utils/router'

const TABS = [
  { key:'top',  label:'Top' },
  { key:'new',  label:'New' },
  { key:'best', label:'Best' },
  { key:'ask',  label:'Ask HN' },
  { key:'show', label:'Show HN' },
  { key:'jobs', label:'Jobs' },
  { key:'comments', label:'Comments' },
  { key:'submit', label:'Submit' },
  { key:'saved', label:'Saved' },
]

export default function Navbar({ route, onSearch, user, onLoginClick, onLogout }){
  return (
    <div className="navbar">
      <div className="nav-inner container">
        <div className="brand" onClick={()=>nav('top')} style={{cursor:'pointer'}}>
          <div className="brand-badge">Y</div>
          <div>HN Clone</div>
        </div>

        <div className="tabs">
          {TABS.map(t => (
            <div key={t.key}
                 className={'tab' + (route.name === t.key ? ' active' : '')}
                 onClick={()=>nav(t.key)}>
              {t.label}
            </div>
          ))}
        </div>

        <div className="grow" />

        <div className="search">
          <input placeholder="Filter by title…"
                 onChange={e => onSearch(e.target.value)}
                  />
          <div className="hint">⌘K</div>
        </div>

        <div className="auth">
          {user ? (
            <>
              <span style={{color:'#9fb0c8', fontSize:13}}>Hi, {user.email}</span>
              <button className="btn ghost" onClick={onLogout}>Logout</button>
            </>
          ) : (
            <button className="btn primary" onClick={onLoginClick}>Login</button>
          )}
        </div>
      </div>
    </div>
  )
}
