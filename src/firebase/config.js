import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyB5k5yLlgnZnVmRmRs0T-oCBwIOL6XupQ4",
  authDomain: "hackernewsclone-24a34.firebaseapp.com",
  projectId: "hackernewsclone-24a34",
  storageBucket: "hackernewsclone-24a34.firebasestorage.app",
  messagingSenderId: "434812404993",
  appId: "1:434812404993:web:895f55b824d102a5a9c700"
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
