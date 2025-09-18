const BASE = 'https://hacker-news.firebaseio.com/v0'

async function json(url){
  const r = await fetch(url)
  if(!r.ok) throw new Error('HTTP '+r.status)
  return r.json()
}

const cache = new Map()

export async function getItem(id){
  const key = `item-${id}`
  if(cache.has(key)) return cache.get(key)
  const data = await json(`${BASE}/item/${id}.json`)
  cache.set(key, data || null)
  return data
}

export async function getUser(id){
  const key = `user-${id}`
  if(cache.has(key)) return cache.get(key)
  const data = await json(`${BASE}/user/${id}.json`)
  cache.set(key, data || null)
  return data
}

export async function getList(kind='top'){
  const map = {
    top: 'topstories',
    new: 'newstories',
    best: 'beststories',
    ask: 'askstories',
    show: 'showstories',
    jobs: 'jobstories'
  }
  const endpoint = map[kind] || 'topstories'
  const key = `list-${endpoint}`
  if(cache.has(key)) return cache.get(key)
  const data = await json(`${BASE}/${endpoint}.json`)
  cache.set(key, data || [])
  return data
}

export async function getMaxItem(){
  const r = await fetch(`${BASE}/maxitem.json`)
  if(!r.ok) throw new Error('HTTP '+r.status)
  return r.json()
}

export function clearCache(){
  cache.clear()
}
