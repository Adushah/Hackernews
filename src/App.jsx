import React from 'react'
import Navbar from './components/Navbar.jsx'
import StoryList from './components/StoryList.jsx'
import ItemPage from './components/ItemPage.jsx'
import UserPage from './components/UserPage.jsx'
import Login from './components/Login.jsx'
import Loader from './components/Loader.jsx'
import CommentsList from './components/CommentsList.jsx'
import SubmitPage from './components/SubmitPage.jsx'

import { parseHash } from './utils/router'
import { watchAuth, logout } from './firebase/auth'
import { fetchBookmarks, toggleBookmark } from './store/bookmarks'

export default function App(){
  const [route, setRoute] = React.useState(parseHash())
  const [filter, setFilter] = React.useState('')
  const [user, setUser] = React.useState(null)
  const [bookmarks, setBookmarks] = React.useState([])
  const [showLogin, setShowLogin] = React.useState(false)

  React.useEffect(()=>{
    const onChange = ()=> setRoute(parseHash())
    window.addEventListener('hashchange', onChange)
    return ()=> window.removeEventListener('hashchange', onChange)
  },[])

  React.useEffect(()=>{
    const un = watchAuth(async (u)=>{
      setUser(u)
      const b = await fetchBookmarks(u?.uid || null)
      setBookmarks(b.map(String))
    })
    return un
  }, [])

  async function handleToggleBookmark(id){
    const list = await toggleBookmark(user?.uid || null, id)
    setBookmarks(list.map(String))
  }

  function renderRoute(){
    if(route.name === 'item'){
      const id = route.params.id
      const isBookmarked = bookmarks.includes(String(id))
      return <ItemPage id={id} isBookmarked={isBookmarked} onToggleBookmark={handleToggleBookmark} />
    }
    if(route.name === 'user'){
      const id = route.params.id
      return <UserPage id={id} bookmarks={bookmarks} onToggleBookmark={handleToggleBookmark} />
    }
    if(route.name === 'comments'){
      return <CommentsList />
    }
    if(route.name === 'submit'){
      return <SubmitPage user={user} />
    }
    if(route.name === 'saved'){
      if(!bookmarks.length) return <div className="loader">No saved stories yet.</div>
      const SavedList = React.lazy(()=>import('./components/SavedList.jsx'))
      return (
        <React.Suspense fallback={<Loader/>}>
          <SavedList ids={bookmarks.map(Number)} bookmarks={bookmarks} onToggleBookmark={handleToggleBookmark} filter={filter} />
        </React.Suspense>
      )
    }
    const kind = route.name 
    return <StoryList kind={kind} filter={filter} bookmarks={bookmarks} onToggleBookmark={handleToggleBookmark} />
  }

  return (
    <div>
      <Navbar route={route}
              onSearch={setFilter}
              user={user}
              onLoginClick={()=>setShowLogin(true)}
              onLogout={logout} />
      <div className="container">
        {renderRoute()}
        <div className="footer">
          <a href="https://news.ycombinator.com/newsguidelines.html" target="_blank" rel="noreferrer">Guidelines</a> |{' '}
          <a href="https://news.ycombinator.com/newsfaq.html" target="_blank" rel="noreferrer">FAQ</a> |{' '}
          <a href="https://news.ycombinator.com/lists" target="_blank" rel="noreferrer">Lists</a> |{' '}
          <a href="https://github.com/HackerNews/API" target="_blank" rel="noreferrer">API</a> |{' '}
          <a href="https://news.ycombinator.com/security.html" target="_blank" rel="noreferrer">Security</a> |{' '}
          <a href="https://www.ycombinator.com/legal/" target="_blank" rel="noreferrer">Legal</a> |{' '}
          <a href="https://www.ycombinator.com/apply/" target="_blank" rel="noreferrer">Apply to YC</a> |{' '}
          <span>Contact: <a href="mailto:hn@ycombinator.com">hn@ycombinator.com</a></span>
        </div>
      </div>
      {showLogin && <Login onClose={()=>setShowLogin(false)} />}
    </div>
  )
}
