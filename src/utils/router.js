export function parseHash(){
  const raw = (location.hash || '#/').slice(2)
  const parts = raw.split('/').filter(Boolean)
  if (parts.length === 0) return { name: 'top', params: {} }
  const [head, p] = parts
  if (head === 'item' && p) return { name: 'item', params: { id: p } }
  if (head === 'user' && p) return { name: 'user', params: { id: p } }
  const known = ['top','new','best','ask','show','jobs','comments','submit','saved']
  return { name: known.includes(head) ? head : 'top', params: {} }
}

export function nav(to){
  if(!to.startsWith('#/')) to = '#/' + to
  if(location.hash !== to) location.hash = to
}
