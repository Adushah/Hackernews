import { db } from '../firebase/config'
import { collection, doc, setDoc, deleteDoc, getDocs, serverTimestamp } from 'firebase/firestore'

const LOCAL_KEY = 'hn_bookmarks_fallback'

export async function fetchBookmarks(uid){
  if(!uid){
    const raw = localStorage.getItem(LOCAL_KEY)
    return raw ? JSON.parse(raw) : []
  }
  try {
    const snap = await getDocs(collection(db, 'bookmarks', uid, 'stories'))
    return snap.docs.map(d => d.id)
  } catch (e){
    console.error('Firestore disabled? Falling back to localStorage', e)
    const raw = localStorage.getItem(LOCAL_KEY)
    return raw ? JSON.parse(raw) : []
  }
}

export async function toggleBookmark(uid, id){
  if(!uid){
    const list = await fetchBookmarks(null)
    const exists = list.includes(String(id))
    const next = exists ? list.filter(x => x !== String(id)) : [...list, String(id)]
    localStorage.setItem(LOCAL_KEY, JSON.stringify(next))
    return next
  }
  const ref = doc(db, 'bookmarks', uid, 'stories', String(id))
  try {
    const list = await fetchBookmarks(uid)
    const exists = list.includes(String(id))
    if (exists){
      await deleteDoc(ref)
      return list.filter(x => x !== String(id))
    } else {
      await setDoc(ref, { createdAt: serverTimestamp() })
      return [...list, String(id)]
    }
  } catch (e){
    console.error('Firestore toggle failed, falling back to localStorage', e)
    return toggleBookmark(null, id)
  }
}
