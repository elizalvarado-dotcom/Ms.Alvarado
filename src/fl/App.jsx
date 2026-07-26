import { useState, useEffect, useRef } from 'react'
import {
  onAuthStateChanged, signInAnonymously, signInWithPopup, signOut, GoogleAuthProvider,
} from 'firebase/auth'
import { auth } from '../firebase.js'
import { T, TEACHER_EMAIL } from './i18n.js'
import { MODULES } from './lessons.js'
import { loadProfile, saveProfile, saveModuleProgress } from './db.js'
import StudentLogin from './StudentLogin.jsx'
import TeacherLogin from './TeacherLogin.jsx'
import Home from './Home.jsx'
import ModuleView from './ModuleView.jsx'
import TeacherDashboard from './TeacherDashboard.jsx'
import { S } from './styles.js'

const googleProvider = new GoogleAuthProvider()

export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem('fl_lang') || 'en')
  const [screen, setScreen] = useState('loading') // loading | studentLogin | teacherLogin | app | teacherDashboard
  const [profile, setProfile] = useState(null)
  const [progress, setProgress] = useState({})
  const [activeModuleId, setActiveModuleId] = useState(null)
  const [authLoading, setAuthLoading] = useState(false)
  const [teacherError, setTeacherError] = useState(null)

  const uidRef = useRef(null)
  const skipNextAuthEvent = useRef(false)

  useEffect(() => { localStorage.setItem('fl_lang', lang) }, [lang])

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async user => {
      if (skipNextAuthEvent.current) { skipNextAuthEvent.current = false; return }

      if (!user) { setScreen('studentLogin'); return }

      uidRef.current = user.uid

      if (user.isAnonymous) {
        const p = await loadProfile(user.uid)
        if (p) {
          setProfile({ firstName: p.firstName, lastName: p.lastName, period: p.period })
          setProgress(p.progress || {})
          setScreen('app')
        } else {
          setScreen('studentLogin')
        }
      } else if (user.email === TEACHER_EMAIL) {
        setScreen('teacherDashboard')
      } else {
        skipNextAuthEvent.current = true
        await signOut(auth)
      }
    })
    return unsub
  }, [])

  async function handleStudentLogin(profileData) {
    setAuthLoading(true)
    try {
      skipNextAuthEvent.current = true
      const cred = await signInAnonymously(auth)
      uidRef.current = cred.user.uid
      await saveProfile(cred.user.uid, profileData)
      setProfile(profileData)
      setProgress({})
      setScreen('app')
    } catch (e) {
      console.error('[StudentLogin]', e)
    } finally {
      setAuthLoading(false)
    }
  }

  async function handleTeacherSignIn() {
    const t = T[lang]
    setAuthLoading(true)
    setTeacherError(null)
    try {
      skipNextAuthEvent.current = true
      const result = await signInWithPopup(auth, googleProvider)
      if (result.user.email === TEACHER_EMAIL) {
        uidRef.current = result.user.uid
        setScreen('teacherDashboard')
      } else {
        skipNextAuthEvent.current = true
        await signOut(auth)
        setProfile(null)
        setTeacherError(t.accessDenied)
      }
    } catch (err) {
      if (err.code === 'auth/popup-blocked') setTeacherError(t.popupBlocked)
      else if (!['auth/cancelled-popup-request', 'auth/popup-closed-by-user'].includes(err.code)) setTeacherError(t.signInFailed)
    } finally {
      setAuthLoading(false)
    }
  }

  function handleQuizComplete(moduleId, score, total) {
    setProgress(prev => {
      const merged = { ...(prev[moduleId] || {}), score, total, completed: true }
      const next = { ...prev, [moduleId]: merged }
      if (uidRef.current) saveModuleProgress(uidRef.current, moduleId, merged).catch(e => console.error('[Progress]', e))
      return next
    })
  }

  function handleSaveBudget(moduleId, budgetData) {
    setProgress(prev => {
      const merged = { ...(prev[moduleId] || {}), budget: budgetData }
      const next = { ...prev, [moduleId]: merged }
      if (uidRef.current) saveModuleProgress(uidRef.current, moduleId, merged).catch(e => console.error('[Budget]', e))
      return next
    })
  }

  async function handleSwitchStudent() {
    skipNextAuthEvent.current = true
    await signOut(auth)
    setProfile(null)
    setProgress({})
    setActiveModuleId(null)
    setTeacherError(null)
    setScreen('studentLogin')
  }

  async function handleTeacherSignOut() {
    skipNextAuthEvent.current = true
    await signOut(auth)
    setTeacherError(null)
    setScreen('studentLogin')
  }

  function goTeacherLogin() {
    setTeacherError(null)
    setScreen('teacherLogin')
  }

  function goStudentLogin() {
    setTeacherError(null)
    setScreen(profile ? 'app' : 'studentLogin')
  }

  if (screen === 'loading') {
    return <div style={{ ...S.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
  }

  if (screen === 'studentLogin') {
    return (
      <StudentLogin
        lang={lang} setLang={setLang}
        onLogin={handleStudentLogin}
        onTeacherClick={goTeacherLogin}
        loading={authLoading}
      />
    )
  }

  if (screen === 'teacherLogin') {
    return (
      <TeacherLogin
        lang={lang} setLang={setLang}
        onSignIn={handleTeacherSignIn}
        onBack={goStudentLogin}
        error={teacherError}
        loading={authLoading}
      />
    )
  }

  if (screen === 'teacherDashboard') {
    return <TeacherDashboard lang={lang} setLang={setLang} onSignOut={handleTeacherSignOut} />
  }

  // screen === 'app'
  if (activeModuleId) {
    const mod = MODULES.find(m => m.id === activeModuleId)
    return (
      <div style={S.page}>
        <div style={S.blob1} /><div style={S.blob2} /><div style={S.blob3} />
        <div style={S.header}>
          <div style={S.headerLeft}>
            <div style={S.headerLogo}>💵</div>
            <span style={S.headerName}>{T[lang].siteName}</span>
          </div>
          <div style={S.headerRight}>
            <span style={S.badge}>{profile.firstName} {profile.lastName} · {T[lang].periodBadge(profile.period)}</span>
          </div>
        </div>
        <ModuleView
          mod={mod} lang={lang} progress={progress}
          onBack={() => setActiveModuleId(null)}
          onCompleteQuiz={handleQuizComplete}
          onSaveBudget={handleSaveBudget}
        />
      </div>
    )
  }

  return (
    <Home
      profile={profile} lang={lang} setLang={setLang} progress={progress}
      onOpenModule={setActiveModuleId}
      onSwitchStudent={handleSwitchStudent}
      onTeacherClick={goTeacherLogin}
    />
  )
}
