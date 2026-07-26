import { useState, useEffect, useRef } from 'react'
import {
  onAuthStateChanged, signInWithPopup, signOut, GoogleAuthProvider,
} from 'firebase/auth'
import { auth } from '../firebase.js'
import { T, TEACHER_EMAIL } from './i18n.js'
import { UNITS, findModule } from './lessons.js'
import TeacherLogin from './TeacherLogin.jsx'
import Home from './Home.jsx'
import UnitDetail from './UnitDetail.jsx'
import ModuleView from './ModuleView.jsx'
import TeacherDashboard from './TeacherDashboard.jsx'
import LangToggle from './LangToggle.jsx'
import { S } from './styles.js'

const googleProvider = new GoogleAuthProvider()

export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem('fl_lang') || 'en')
  const [screen, setScreen] = useState('home') // home | teacherLogin | teacherDashboard
  const [progress, setProgress] = useState({})
  const [activeUnitId, setActiveUnitId] = useState(null)
  const [activeModuleId, setActiveModuleId] = useState(null)
  const [authLoading, setAuthLoading] = useState(false)
  const [teacherError, setTeacherError] = useState(null)

  const skipNextAuthEvent = useRef(false)

  useEffect(() => { localStorage.setItem('fl_lang', lang) }, [lang])

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async user => {
      if (skipNextAuthEvent.current) { skipNextAuthEvent.current = false; return }
      if (!user) return
      if (user.email === TEACHER_EMAIL) {
        setScreen('teacherDashboard')
      } else {
        skipNextAuthEvent.current = true
        await signOut(auth)
      }
    })
    return unsub
  }, [])

  async function handleTeacherSignIn() {
    const t = T[lang]
    setAuthLoading(true)
    setTeacherError(null)
    try {
      skipNextAuthEvent.current = true
      const result = await signInWithPopup(auth, googleProvider)
      if (result.user.email === TEACHER_EMAIL) {
        setScreen('teacherDashboard')
      } else {
        skipNextAuthEvent.current = true
        await signOut(auth)
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
    setProgress(prev => ({ ...prev, [moduleId]: { score, total, completed: true } }))
  }

  async function handleTeacherSignOut() {
    skipNextAuthEvent.current = true
    await signOut(auth)
    setTeacherError(null)
    setScreen('home')
  }

  function goTeacherLogin() {
    setTeacherError(null)
    setScreen('teacherLogin')
  }

  function goHome() {
    setTeacherError(null)
    setScreen('home')
  }

  if (screen === 'teacherLogin') {
    return (
      <TeacherLogin
        lang={lang} setLang={setLang}
        onSignIn={handleTeacherSignIn}
        onBack={goHome}
        error={teacherError}
        loading={authLoading}
      />
    )
  }

  if (screen === 'teacherDashboard') {
    return <TeacherDashboard lang={lang} setLang={setLang} onSignOut={handleTeacherSignOut} />
  }

  // screen === 'home'
  if (activeModuleId) {
    const found = findModule(activeModuleId)
    const mod = found
      ? { ...found.mod, icon: found.unit.icon, color: found.unit.color, colorDim: found.unit.colorDim, colorBorder: found.unit.colorBorder }
      : null
    return (
      <div style={S.page}>
        <div style={S.blob1} /><div style={S.blob2} /><div style={S.blob3} />
        <div style={S.header}>
          <div style={S.headerLeft}>
            <div style={S.headerLogo}>💵</div>
            <span style={S.headerName}>{T[lang].siteName}</span>
          </div>
          <div style={S.headerRight}>
            <LangToggle lang={lang} setLang={setLang} />
          </div>
        </div>
        <ModuleView
          mod={mod} lang={lang}
          onBack={() => setActiveModuleId(null)}
          onCompleteQuiz={handleQuizComplete}
        />
      </div>
    )
  }

  if (activeUnitId) {
    const unit = UNITS.find(u => u.id === activeUnitId)
    return (
      <div style={S.page}>
        <div style={S.blob1} /><div style={S.blob2} /><div style={S.blob3} />
        <div style={S.header}>
          <div style={S.headerLeft}>
            <div style={S.headerLogo}>💵</div>
            <span style={S.headerName}>{T[lang].siteName}</span>
          </div>
          <div style={S.headerRight}>
            <LangToggle lang={lang} setLang={setLang} />
          </div>
        </div>
        <UnitDetail
          unit={unit} lang={lang} progress={progress}
          onBack={() => setActiveUnitId(null)}
          onOpenModule={setActiveModuleId}
        />
      </div>
    )
  }

  return (
    <Home
      lang={lang} setLang={setLang}
      onOpenUnit={setActiveUnitId}
      onTeacherClick={goTeacherLogin}
    />
  )
}
