import { auth } from './config'
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth'

export function watchAuth(cb){
  return onAuthStateChanged(auth, cb)
}

export async function login(email, password){
  const res = await signInWithEmailAndPassword(auth, email, password)
  return res.user
}

export async function register(email, password){
  const res = await createUserWithEmailAndPassword(auth, email, password)
  return res.user
}

export async function logout(){
  await signOut(auth)
}
