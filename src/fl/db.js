import { doc, setDoc, getDoc, updateDoc, collection, onSnapshot, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.js'

const studentDoc = uid => doc(db, 'flStudents', uid)

export async function loadProfile(uid) {
  const snap = await getDoc(studentDoc(uid))
  return snap.exists() ? snap.data() : null
}

export async function saveProfile(uid, { firstName, lastName, period }) {
  await setDoc(studentDoc(uid), {
    firstName, lastName, period,
    updatedAt: serverTimestamp(),
  }, { merge: true })
}

export async function saveModuleProgress(uid, moduleId, moduleData) {
  await updateDoc(studentDoc(uid), {
    [`progress.${moduleId}`]: moduleData,
    updatedAt: serverTimestamp(),
  })
}

export function subscribeAllStudents(onData) {
  return onSnapshot(collection(db, 'flStudents'), snap => {
    const rows = snap.docs.map(d => ({ uid: d.id, ...d.data() }))
    onData(rows)
  })
}
