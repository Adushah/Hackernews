export function timeAgo(ts){
  const sec = Math.max(1, Math.floor(Date.now()/1000 - ts))
  const units = [
    ['year', 31536000],
    ['month', 2592000],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
    ['second', 1]
  ]
  for(const [name, s] of units){
    const v = Math.floor(sec / s)
    if(v >= 1){
      return v + ' ' + name + (v>1?'s':'') + ' ago'
    }
  }
  return 'just now'
}

export function hostname(url=''){
  try {
    return new URL(url).hostname.replace('www.','')
  } catch{
    return ''
  }
}
