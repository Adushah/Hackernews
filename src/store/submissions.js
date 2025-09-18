import { db } from '../firebase/config'
import { collection, addDoc, getDocs, query, where, orderBy, serverTimestamp } from 'firebase/firestore'

const LOCAL_KEY = 'hn_submissions_fallback'

export async function addSubmission(uid, payload){
  const item = {
    title: payload.title || '',
    url: payload.url || '',
    text: payload.text || '',
    uid: uid || 'anon',
    createdAt: Date.now()
  }

  if(!uid){
    const list = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]')
    list.unshift(item)
    localStorage.setItem(LOCAL_KEY, JSON.stringify(list))
    return item
  }

  try{
    const col = collection(db, 'submissions')
    await addDoc(col, { ...item, createdAt: serverTimestamp() })
    return item
  }catch(e){
    const list = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]')
    list.unshift(item)
    localStorage.setItem(LOCAL_KEY, JSON.stringify(list))
    return item
  }
}

export async function fetchMySubmissions(uid){
  if(!uid){
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]')
  }
  try{
    const col = collection(db, 'submissions')
    const q = query(col, where('uid','==',uid), orderBy('createdAt','desc'))
    const snap = await getDocs(q)
    return snap.docs.map(d => {
      const data = d.data()
      return {
        ...data,
        createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : (data.createdAt || Date.now())
      }
    })
  }catch(e){
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]')
  }
}
