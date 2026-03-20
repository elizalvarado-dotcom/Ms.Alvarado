import { useState, useEffect, useCallback } from 'react'
import {
  getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged,
} from 'firebase/auth'
import {
  getFirestore, doc, setDoc, addDoc, collection, getDocs, serverTimestamp,
} from 'firebase/firestore'
import { initializeApp } from 'firebase/app'
import './App.css'

/* ── Firebase ─────────────────────────────────────────────────────────────── */
const firebaseConfig = {
  apiKey:            'AIzaSyAbnknXhx9VYY9L8UFW6uMpNYLM6SRsMVg',
  authDomain:        'solving-systems-activities.firebaseapp.com',
  projectId:         'solving-systems-activities',
  storageBucket:     'solving-systems-activities.firebasestorage.app',
  messagingSenderId: '81374640982',
  appId:             '1:81374640982:web:ad4796df648ddf464774f7',
}
const firebaseApp = initializeApp(firebaseConfig)
const auth        = getAuth(firebaseApp)
const db          = getFirestore(firebaseApp)
const provider    = new GoogleAuthProvider()

const TEACHER_EMAIL = 'elizalvarado@paps.net'
const isTeacher = email => email === TEACHER_EMAIL

/* ── Score saver ──────────────────────────────────────────────────────────── */
async function saveScore(user, activity, score, total) {
  if (!user) return
  try {
    await setDoc(doc(db, 'scores', `${activity}_${user.email}`), {
      email: user.email, displayName: user.displayName || user.email,
      activity, score, total, updatedAt: serverTimestamp(),
    }, { merge: true })
  } catch (e) { console.error('[Score]', e) }
}

/* ── Feedback saver ───────────────────────────────────────────────────────── */
async function submitFeedback({ studentName, studentEmail, type, message, page }) {
  try {
    await addDoc(collection(db, 'feedback'), {
      studentName, studentEmail, type, message, page,
      timestamp: serverTimestamp(),
      read: false,
    })
    return true
  } catch (e) { console.error('[Feedback]', e); return false }
}

/* ── CSV Export ───────────────────────────────────────────────────────────── */
function downloadCSV(filename, rows) {
  const csv = rows.map(r => r.map(c => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(a.href)
}

/* ── Translations ─────────────────────────────────────────────────────────── */
const LANGS = {
  en: {
    back: '← Back',
    assignments: '📚 Assignments',
    dashboard: '📊 Dashboard',
    signOut: 'Sign out',
    welcomeBack: 'Welcome back 👋',
    getStarted: 'Select an assignment below to get started. Progress saves automatically.',
    chooseTutor: 'Choose a method to practice. Your Socratic tutor will guide you step by step.',
    pickMethods: n => `Pick from ${n} methods`,
    clickOpen: 'Click to open',
    footerText: 'Bilingual support (EN / ES) · Progress autosaved to Firebase',
    fbBtn: 'Feedback',
    fbTitle: 'Share Feedback',
    fbSub: 'Your response goes directly to Miss Alvarado.',
    fbTypeQ: 'What type of feedback?',
    fbBugQ: 'Describe the bug — what happened and where?',
    fbGenQ: 'What would you like to share?',
    fbBugP: "e.g. \"The word bank chips didn't shuffle on the Exponential Functions page.\"",
    fbGenP: 'e.g. "It would be cool if there were more practice problems for substitution."',
    fbPage: 'Page',
    fbStudent: 'Student',
    cancel: 'Cancel',
    submit: 'Submit Feedback',
    sending: 'Sending…',
    sent: '✅ Sent! Thank you!',
    errConn: '⚠️ Could not send. Check your connection and try again.',
    bugLabel: '🐛 Bug Found',
    suggLabel: '💡 Suggestion',
    genLabel: '👍 General',
    loginSub: 'Sign in with your school Google account to access your assignments.',
    signInG: 'Sign in with Google',
    signingIn: 'Signing in…',
    popupBlocked: 'Popup blocked. Please allow popups for this site and try again.',
    signInFailed: 'Sign-in failed. Please try again.',
  },
  es: {
    back: '← Regresar',
    assignments: '📚 Tareas',
    dashboard: '📊 Panel',
    signOut: 'Cerrar sesión',
    welcomeBack: '¡Bienvenido! 👋',
    getStarted: 'Selecciona una tarea para comenzar. El progreso se guarda automáticamente.',
    chooseTutor: 'Elige un método para practicar. Tu tutor socrático te guiará paso a paso.',
    pickMethods: n => `Elige entre ${n} métodos`,
    clickOpen: 'Clic para abrir',
    footerText: 'Soporte bilingüe (EN / ES) · Progreso guardado automáticamente en Firebase',
    fbBtn: 'Comentarios',
    fbTitle: 'Compartir Comentarios',
    fbSub: 'Tu respuesta llega directamente a la Sra. Alvarado.',
    fbTypeQ: '¿Qué tipo de comentario?',
    fbBugQ: 'Describe el error — ¿qué pasó y dónde?',
    fbGenQ: '¿Qué quieres compartir?',
    fbBugP: 'ej. "Las fichas del banco de palabras no se mezclaron..."',
    fbGenP: 'ej. "Sería genial tener más problemas de práctica..."',
    fbPage: 'Página',
    fbStudent: 'Estudiante',
    cancel: 'Cancelar',
    submit: 'Enviar Comentarios',
    sending: 'Enviando…',
    sent: '✅ ¡Enviado! ¡Gracias!',
    errConn: '⚠️ No se pudo enviar. Revisa tu conexión e intenta de nuevo.',
    bugLabel: '🐛 Error Encontrado',
    suggLabel: '💡 Sugerencia',
    genLabel: '👍 General',
    loginSub: 'Inicia sesión con tu cuenta de Google escolar para acceder a tus tareas.',
    signInG: 'Iniciar sesión con Google',
    signingIn: 'Iniciando sesión…',
    popupBlocked: 'Ventana emergente bloqueada. Permite ventanas emergentes e intenta de nuevo.',
    signInFailed: 'Error al iniciar sesión. Intenta de nuevo.',
  },
}

/* ── Helper: resolve bilingual string ───────────────────────────────────────*/
const L = (val, lang) => (val && typeof val === 'object') ? (val[lang] ?? val.en) : (val ?? '')

/* ── Feedback types (language-aware) ─────────────────────────────────────── */
const getFbTypes = t => [
  { id:'bug',        label: t.bugLabel,  color:'#f87171', dim:'rgba(248,113,113,0.12)', border:'rgba(248,113,113,0.3)' },
  { id:'suggestion', label: t.suggLabel, color:'#e8a832', dim:'rgba(232,168,50,0.12)',  border:'rgba(232,168,50,0.3)'  },
  { id:'general',    label: t.genLabel,  color:'#34d399', dim:'rgba(52,211,153,0.12)',  border:'rgba(52,211,153,0.3)'  },
]

/* ── Curriculum data (bilingual) ──────────────────────────────────────────── */
const UNITS = [
  {
    id: 'm2t2',
    unit: 'M2T2',
    title: { en: 'Systems of Equations', es: 'Sistemas de Ecuaciones' },
    color: '#4fc3f7',
    colorDim: 'rgba(79,195,247,0.08)',
    colorBorder: 'rgba(79,195,247,0.22)',
    icon: '📈',
    assignments: [
      {
        id: 'systems-equations',
        label: { en: 'Systems of Equations', es: 'Sistemas de Ecuaciones' },
        icon: '📈',
        tag:  { en: 'Test Review', es: 'Repaso de Examen' },
        desc: { en: 'Practice solving systems of equations using three different algebraic methods.', es: 'Practica resolver sistemas de ecuaciones con tres métodos algebraicos diferentes.' },
        color: '#4fc3f7',
        colorDim: 'rgba(79,195,247,0.10)',
        colorBorder: 'rgba(79,195,247,0.25)',
        methods: [
          {
            id: 'graphing',
            label: { en: 'Graphing',      es: 'Graficación' },
            icon: '📈',
            tag:  { en: 'Method 1',       es: 'Método 1' },
            file: '/systems-graphing-socratic.html',
            color: '#4fc3f7', colorDim: 'rgba(79,195,247,0.12)', colorBorder: 'rgba(79,195,247,0.28)',
            desc: { en: 'Graph both equations and find where the lines intersect.', es: 'Grafica ambas ecuaciones y encuentra dónde se intersecan.' },
          },
          {
            id: 'substitution',
            label: { en: 'Substitution',  es: 'Sustitución' },
            icon: '🔁',
            tag:  { en: 'Method 2',       es: 'Método 2' },
            file: '/systems-substitution-socratic.html',
            color: '#34d399', colorDim: 'rgba(52,211,153,0.12)', colorBorder: 'rgba(52,211,153,0.28)',
            desc: { en: 'Solve for one variable, then substitute into the other equation.', es: 'Despeja una variable y sustitúyela en la otra ecuación.' },
          },
          {
            id: 'elimination',
            label: { en: 'Elimination',   es: 'Eliminación' },
            icon: '➕',
            tag:  { en: 'Method 3',       es: 'Método 3' },
            file: '/systems-elimination-socratic.html',
            color: '#e8a832', colorDim: 'rgba(232,168,50,0.12)', colorBorder: 'rgba(232,168,50,0.28)',
            desc: { en: 'Add or subtract equations to eliminate a variable and solve.', es: 'Suma o resta ecuaciones para eliminar una variable y resolver.' },
          },
        ],
      },
    ],
  },
  {
    id: 'm2t3',
    unit: 'M2T3',
    title: { en: 'Systems of Inequalities', es: 'Sistemas de Desigualdades' },
    color: '#a78bfa',
    colorDim: 'rgba(167,139,250,0.08)',
    colorBorder: 'rgba(167,139,250,0.22)',
    icon: '≥',
    assignments: [
      {
        id: 'systems-inequalities',
        label: { en: 'Systems of Inequalities', es: 'Sistemas de Desigualdades' },
        icon: '≥',
        tag:  { en: 'Practice', es: 'Práctica' },
        desc: { en: 'Graph solution regions and identify intersections for systems of linear inequalities.', es: 'Grafica regiones de solución e identifica intersecciones de sistemas de desigualdades lineales.' },
        color: '#a78bfa',
        colorDim: 'rgba(167,139,250,0.10)',
        colorBorder: 'rgba(167,139,250,0.25)',
        file: '/systems-inequalities-practice.html',
      },
    ],
  },
  {
    id: 'm3t1',
    unit: 'M3T1',
    title: { en: 'Exponential Functions', es: 'Funciones Exponenciales' },
    color: '#D4681A',
    colorDim: 'rgba(212,104,26,0.08)',
    colorBorder: 'rgba(212,104,26,0.22)',
    icon: 'x²',
    assignments: [
      {
        id: 'exponential',
        label: { en: 'Exponential Functions', es: 'Funciones Exponenciales' },
        icon: 'x²',
        tag:  { en: 'M3T1L1 · Homework', es: 'M3T1L1 · Tarea' },
        desc: { en: 'Geometric sequences, common ratio, exponential growth & decay. Bilingual (EN/ES).', es: 'Sucesiones geométricas, razón común, crecimiento y decaimiento exponencial. Bilingüe (EN/ES).' },
        color: '#D4681A',
        colorDim: 'rgba(212,104,26,0.12)',
        colorBorder: 'rgba(212,104,26,0.28)',
        dark: true,
        file: '/M3T1L1_Homework_Practice.html',
      },
      {
        id: 'writing-exponential',
        label: { en: 'Writing Exponential Functions', es: 'Escribir Funciones Exponenciales' },
        icon: 'x²',
        tag:  { en: 'M3T1L2 · Homework', es: 'M3T1L2 · Tarea' },
        desc: { en: 'Determine a (y-intercept) and b (common ratio) from tables and graphs. Includes increasing & decreasing examples. Bilingual (EN/ES).', es: 'Determina a (intersección y) y b (razón común) de tablas y gráficas. Incluye ejemplos crecientes y decrecientes. Bilingüe (EN/ES).' },
        color: '#a78bfa',
        colorDim: 'rgba(167,139,250,0.10)',
        colorBorder: 'rgba(167,139,250,0.28)',
        dark: true,
        file: '/M3T1L2_Writing_Exponential_Functions.html',
      },
      {
        id: 'exp-growth-decay-word-problems',
        label: { en: 'Exponential Growth & Decay Word Problems', es: 'Problemas de Crecimiento y Decaimiento Exponencial' },
        icon: '📊',
        tag:  { en: 'M3T2 · Skills Practice', es: 'M3T2 · Práctica de Habilidades' },
        desc: { en: 'Write exponential population functions from real-world growth and decay scenarios. Identify a, b, and build P(t) = a·b^t. Bilingual (EN/ES).', es: 'Escribe funciones exponenciales de crecimiento y decaimiento poblacional a partir de situaciones reales. Identifica a, b y construye P(t) = a·b^t. Bilingüe (EN/ES).' },
        color: '#34d399',
        colorDim: 'rgba(52,211,153,0.10)',
        colorBorder: 'rgba(52,211,153,0.28)',
        dark: true,
        file: '/M3T2_ExpGrowthDecay_Skills_Practice.html',
      },
    ],
  },
]

/* ── Module groupings ─────────────────────────────────────────────────────── */
const MODULES = [
  {
    id: 'm2',
    number: 2,
    title: { en: 'Systems of Equations and Inequalities', es: 'Sistemas de Ecuaciones y Desigualdades' },
    color: '#4fc3f7',
    colorDim: 'rgba(79,195,247,0.08)',
    colorBorder: 'rgba(79,195,247,0.22)',
    icon: '📈',
    unitIds: ['m2t2', 'm2t3'],
  },
  {
    id: 'm3',
    number: 3,
    title: { en: 'Exponential Functions', es: 'Funciones Exponenciales' },
    color: '#D4681A',
    colorDim: 'rgba(212,104,26,0.08)',
    colorBorder: 'rgba(212,104,26,0.22)',
    icon: 'x²',
    unitIds: ['m3t1'],
  },
]

/* ── Math icon detection ───────────────────────────────────────────────────── */
const MATH_ICONS = ['≥','∪','∩','≤','x²','x^2']
const isMathIcon = icon => MATH_ICONS.includes(icon)

/* ── Lang Toggle ──────────────────────────────────────────────────────────── */
function LangToggle({ lang, setLang }) {
  return (
    <div style={S.langToggle}>
      {['en','es'].map(l => (
        <button
          key={l}
          onClick={() => setLang(l)}
          style={{ ...S.langBtn, ...(lang === l ? S.langBtnActive : {}) }}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

/* ── Google Icon ──────────────────────────────────────────────────────────── */
function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  )
}

/* ── Login Screen ─────────────────────────────────────────────────────────── */
function LoginScreen({ lang, setLang }) {
  const t = LANGS[lang]
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  async function handleSignIn() {
    setLoading(true); setError(null)
    try {
      await signInWithPopup(auth, provider)
    } catch (err) {
      if (err.code === 'auth/popup-blocked')
        setError(t.popupBlocked)
      else if (!['auth/cancelled-popup-request','auth/popup-closed-by-user'].includes(err.code))
        setError(t.signInFailed)
      setLoading(false)
    }
  }

  return (
    <div style={S.loginBg}>
      <div style={S.blob1} /><div style={S.blob2} /><div style={S.blob3} />
      {/* Language toggle top-right */}
      <div style={{ position:'absolute', top:'20px', right:'24px', zIndex:2 }}>
        <LangToggle lang={lang} setLang={setLang} />
      </div>
      <div style={S.loginCard}>
        <div style={S.loginLogoBox}>∑</div>
        <p style={S.loginEyebrow}>Algebra 1 · 2025–2026</p>
        <h1 style={S.loginTitle}>Miss Alvarado's<br />Algebra World</h1>
        <p style={S.loginSub}>{t.loginSub}</p>
        {error && <p style={S.loginErr}>{error}</p>}
        <button onClick={handleSignIn} disabled={loading}
          style={{ ...S.googleBtn, opacity: loading ? .65 : 1 }}>
          <GoogleIcon />
          {loading ? t.signingIn : t.signInG}
        </button>
      </div>
    </div>
  )
}

/* ── Assignment Card ──────────────────────────────────────────────────────── */
function AssignmentCard({ assignment: a, onOpen, lang }) {
  const [hov, setHov] = useState(false)
  const math = isMathIcon(a.icon)

  return (
    <button
      onClick={() => onOpen(a)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        ...S.aCard,
        ...(a.dark ? S.aCardDark : {}),
        borderColor:    hov ? a.colorBorder : 'rgba(255,255,255,0.07)',
        borderTopColor: a.color,
        background:     hov
          ? (a.dark ? 'rgba(8,13,28,0.95)' : a.colorDim)
          : (a.dark ? 'rgba(8,13,28,0.88)' : 'rgba(14,21,40,0.70)'),
        transform:  hov ? 'translateY(-5px)' : 'translateY(0)',
        boxShadow:  hov
          ? `0 20px 48px rgba(0,0,0,.45), 0 0 0 1px ${a.colorBorder}`
          : (a.dark ? '0 6px 28px rgba(0,0,0,.4)' : '0 4px 24px rgba(0,0,0,.28)'),
      }}
    >
      {/* Icon + tag + label */}
      <div style={{ display:'flex', alignItems:'flex-start', gap:'14px' }}>
        <div style={{
          ...S.aIcon,
          background: a.colorDim, border: `1px solid ${a.colorBorder}`,
          fontFamily: math ? "'JetBrains Mono',monospace" : 'inherit',
          fontSize:   math ? '1.25rem' : '1.4rem',
          color:      math ? a.color : 'inherit',
          fontWeight: math ? 800 : 'inherit',
          letterSpacing: a.icon === 'x²' ? '-0.5px' : 'normal',
        }}>
          {a.icon}
        </div>
        <div style={{ flex:1, textAlign:'left' }}>
          <div style={{ ...S.aTag, color:a.color, background:a.colorDim, border:`1px solid ${a.colorBorder}` }}>
            {L(a.tag, lang)}{a.methods ? ` · ${a.methods.length} ${lang === 'es' ? 'métodos' : 'methods'}` : ''}
          </div>
          <div style={S.aLabel}>{L(a.label, lang)}</div>
          <div style={{ ...S.aDesc, color: a.dark ? 'rgba(237,233,244,0.55)' : '#6b7a9a' }}>{L(a.desc, lang)}</div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ ...S.aFooter, borderTopColor: a.dark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.06)' }}>
        <span style={{ fontSize:'.76rem', color: a.dark ? 'rgba(237,233,244,0.4)' : '#6b7a9a' }}>
          {a.methods ? LANGS[lang].pickMethods(a.methods.length) : LANGS[lang].clickOpen}
        </span>
        <div style={{ ...S.aArrow, background:a.colorDim, color:a.color, transform: hov ? 'translateX(4px)' : 'translateX(0)' }}>
          →
        </div>
      </div>
    </button>
  )
}

/* ── Module Card ──────────────────────────────────────────────────────────── */
function ModuleCard({ mod, onOpen, lang }) {
  const [hov, setHov] = useState(false)
  const math = isMathIcon(mod.icon)
  const units = UNITS.filter(u => mod.unitIds.includes(u.id))
  const assignmentCount = units.reduce((n, u) => n + u.assignments.length, 0)

  return (
    <button
      onClick={() => onOpen(mod)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? mod.colorDim : 'rgba(14,21,40,0.70)',
        border: `1px solid ${hov ? mod.colorBorder : 'rgba(255,255,255,0.07)'}`,
        borderTop: `4px solid ${mod.color}`,
        borderRadius: '24px',
        padding: '32px 28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
        cursor: 'pointer',
        textAlign: 'left',
        fontFamily: "'Inter',sans-serif",
        transition: 'transform .25s ease,box-shadow .25s ease,border-color .25s ease,background .25s',
        backdropFilter: 'blur(12px)',
        width: '100%',
        transform: hov ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hov
          ? `0 24px 56px rgba(0,0,0,.48), 0 0 0 1px ${mod.colorBorder}`
          : '0 4px 24px rgba(0,0,0,.28)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: '56px', height: '56px', borderRadius: '16px', flexShrink: 0,
          background: mod.colorDim, border: `1px solid ${mod.colorBorder}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: math ? '1.4rem' : '1.6rem',
          color: math ? mod.color : 'inherit',
          fontFamily: math ? "'JetBrains Mono',monospace" : 'inherit',
          fontWeight: math ? 800 : 'inherit',
        }}>
          {mod.icon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', fontWeight: 700,
            letterSpacing: '1.5px', textTransform: 'uppercase',
            color: mod.color, marginBottom: '6px',
          }}>
            Module {mod.number} · {assignmentCount} {lang === 'es' ? (assignmentCount === 1 ? 'actividad' : 'actividades') : (assignmentCount === 1 ? 'activity' : 'activities')}
          </div>
          <div style={{
            fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.2rem', fontWeight: 800,
            color: '#ede9f4', lineHeight: 1.2,
          }}>
            {L(mod.title, lang)}
          </div>
        </div>
      </div>
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '8px',
      }}>
        {units.flatMap(u => u.assignments).map(a => (
          <span key={a.id} style={{
            padding: '4px 12px', borderRadius: '20px', fontSize: '.75rem', fontWeight: 600,
            fontFamily: "'Inter',sans-serif",
            background: a.colorDim, border: `1px solid ${a.colorBorder}`, color: a.color,
          }}>
            {L(a.label, lang)}
          </span>
        ))}
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        <span style={{ fontSize: '.78rem', color: '#6b7a9a' }}>
          {lang === 'es' ? 'Clic para abrir el módulo' : 'Click to open module'}
        </span>
        <div style={{
          width: '30px', height: '30px', borderRadius: '50%',
          background: mod.colorDim, border: `1px solid ${mod.colorBorder}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '.9rem', color: mod.color,
          transform: hov ? 'translateX(5px)' : 'translateX(0)',
          transition: 'transform .2s',
        }}>→</div>
      </div>
    </button>
  )
}

/* ── Modules Home Page ────────────────────────────────────────────────────── */
function ModulesPage({ user, onOpen, lang, setLang }) {
  const t = LANGS[lang]
  const firstName = user.displayName?.split(' ')[0] || (lang === 'es' ? 'Estudiante' : 'Student')

  return (
    <div style={S.scrollPage}>
      <div style={S.pageInner}>
        <div style={S.greeting}>
          <div style={S.greetEyebrow}>{t.welcomeBack}</div>
          <h2 style={S.greetName}>{firstName}</h2>
          <p style={S.greetSub}>{t.getStarted}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: '24px' }}>
          {MODULES.map(mod => (
            <ModuleCard key={mod.id} mod={mod} onOpen={onOpen} lang={lang} />
          ))}
        </div>

        <div style={S.pageFooter}>
          <span style={S.footerDot} />
          {t.footerText}
        </div>
      </div>
    </div>
  )
}

/* ── Module Detail Page (assignments within a module) ─────────────────────── */
function ModuleDetailPage({ mod, onOpen, lang, user }) {
  const baseUnits = UNITS.filter(u => mod.unitIds.includes(u.id))
  const math = isMathIcon(mod.icon)
  const teacher = isTeacher(user?.email)

  const [customizeMode, setCustomizeMode] = useState(false)
  const [unitOrders, setUnitOrders] = useState(() => {
    try { return JSON.parse(localStorage.getItem(`unitOrders_${mod.id}`) || '{}') }
    catch { return {} }
  })
  const [drag,     setDrag]     = useState(null) // { unitId, idx }
  const [dragOver, setDragOver] = useState(null) // { unitId, idx }

  const getOrderedAssignments = (unit) => {
    const order = unitOrders[unit.id]
    if (!order) return unit.assignments
    const aMap = Object.fromEntries(unit.assignments.map(a => [a.id, a]))
    return order.map(id => aMap[id]).filter(Boolean)
  }

  const dropAssignment = (unitId, toIdx) => {
    if (!drag || drag.unitId !== unitId || drag.idx === toIdx) return
    const unit = baseUnits.find(u => u.id === unitId)
    const newOrder = getOrderedAssignments(unit).map(a => a.id)
    const [removed] = newOrder.splice(drag.idx, 1)
    newOrder.splice(toIdx, 0, removed)
    const newOrders = { ...unitOrders, [unitId]: newOrder }
    setUnitOrders(newOrders)
    localStorage.setItem(`unitOrders_${mod.id}`, JSON.stringify(newOrders))
  }

  return (
    <div style={S.scrollPage}>
      <div style={S.pageInner}>
        <div style={{ marginBottom: '40px', textAlign: 'center', position: 'relative' }}>
          {teacher && (
            <button
              onClick={() => { setCustomizeMode(m => !m); setDrag(null); setDragOver(null) }}
              style={{
                position: 'absolute', top: 0, right: 0,
                padding: '6px 14px', borderRadius: '20px',
                border: `1px solid ${customizeMode ? 'rgba(167,139,250,0.5)' : 'rgba(255,255,255,0.1)'}`,
                background: customizeMode ? 'rgba(167,139,250,0.15)' : 'rgba(255,255,255,0.04)',
                color: customizeMode ? '#a78bfa' : '#6b7a9a',
                fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: '.8rem', cursor: 'pointer',
              }}
            >
              {customizeMode ? '✓ Done' : '✏️ Customize'}
            </button>
          )}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            background: mod.colorDim, border: `1px solid ${mod.colorBorder}`,
            borderRadius: '20px', padding: '6px 16px', marginBottom: '16px',
          }}>
            <span style={{
              color: mod.color, fontFamily: math ? "'JetBrains Mono',monospace" : 'inherit',
              fontSize: math ? '1rem' : '1.1rem', fontWeight: 800,
            }}>{mod.icon}</span>
            <span style={{
              fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', fontWeight: 700,
              letterSpacing: '1.5px', textTransform: 'uppercase', color: mod.color,
            }}>Module {mod.number}</span>
          </div>
          <h2 style={S.greetName}>{L(mod.title, lang)}</h2>
          <p style={S.greetSub}>
            {lang === 'es' ? 'Selecciona una actividad para comenzar.' : 'Select an activity to get started.'}
          </p>
          {customizeMode && (
            <p style={{ color: '#a78bfa', fontSize: '.82rem', fontFamily: "'Inter',sans-serif", marginTop: '8px' }}>
              Drag activities to reorder them. Your order is saved automatically.
            </p>
          )}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'24px' }}>
          {baseUnits.map(unit => (
            <div key={unit.id} style={S.unitCol}>
              <div style={S.unitHead}>
                <span style={{
                  ...S.unitPill,
                  color: unit.color, background: unit.colorDim,
                  border: `1px solid ${unit.colorBorder}`,
                  fontFamily: isMathIcon(unit.icon) ? "'JetBrains Mono',monospace" : 'inherit',
                }}>
                  {unit.icon} {unit.unit}
                </span>
                <span style={S.unitTitle}>{L(unit.title, lang)}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', overflowX: 'auto', gap: '16px', paddingBottom: '8px', WebkitOverflowScrolling: 'touch' }}>
                {getOrderedAssignments(unit).map((a, idx) => {
                  const isDragging   = drag?.unitId === unit.id && drag?.idx === idx
                  const isDropTarget = dragOver?.unitId === unit.id && dragOver?.idx === idx
                  return (
                    <div
                      key={a.id}
                      draggable={customizeMode}
                      onDragStart={() => setDrag({ unitId: unit.id, idx })}
                      onDragOver={e => { if (!customizeMode) return; e.preventDefault(); setDragOver({ unitId: unit.id, idx }) }}
                      onDragLeave={() => setDragOver(null)}
                      onDrop={e => { e.preventDefault(); dropAssignment(unit.id, idx); setDrag(null); setDragOver(null) }}
                      onDragEnd={() => { setDrag(null); setDragOver(null) }}
                      style={{
                        flex: '0 0 280px', width: '280px',
                        opacity: isDragging ? 0.45 : 1,
                        outline: isDropTarget ? '2px dashed #a78bfa' : 'none',
                        outlineOffset: '4px',
                        borderRadius: '20px',
                        cursor: customizeMode ? (isDragging ? 'grabbing' : 'grab') : 'auto',
                        transition: 'opacity .2s',
                      }}
                    >
                      {customizeMode && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', paddingLeft: '4px' }}>
                          <span style={{ color: '#a78bfa', fontSize: '.75rem', fontFamily: "'Inter',sans-serif", userSelect: 'none' }}>
                            ⠿ Drag to reorder
                          </span>
                        </div>
                      )}
                      <AssignmentCard assignment={a} onOpen={customizeMode ? () => {} : onOpen} lang={lang} />
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Method Card ──────────────────────────────────────────────────────────── */
function MethodCard({ method: m, onOpen, lang }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={() => onOpen(m)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        ...S.mCard,
        borderColor: hov ? m.colorBorder : 'rgba(255,255,255,0.07)',
        background:  hov ? m.colorDim    : 'rgba(14,21,40,0.65)',
        transform:   hov ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow:   hov
          ? `0 16px 40px rgba(0,0,0,.35), 0 0 0 1px ${m.colorBorder}`
          : '0 4px 20px rgba(0,0,0,.25)',
      }}
    >
      <div style={{ ...S.mIcon, background:m.colorDim, border:`1px solid ${m.colorBorder}` }}>{m.icon}</div>
      <div style={{ ...S.mTag, color:m.color }}>{L(m.tag, lang)}</div>
      <div style={S.mLabel}>{L(m.label, lang)}</div>
      <div style={S.mDesc}>{L(m.desc, lang)}</div>
      <div style={{ ...S.mGo, color:m.color, background:m.colorDim, border:`1px solid ${m.colorBorder}`, transform: hov ? 'translateX(3px)' : 'translateX(0)' }}>
        {lang === 'es' ? 'Comenzar →' : 'Start →'}
      </div>
    </button>
  )
}

/* ── Methods Picker ───────────────────────────────────────────────────────── */
function MethodsPicker({ assignment: a, onOpen, lang }) {
  const t = LANGS[lang]
  return (
    <div style={S.scrollPage}>
      <div style={S.pageInner}>
        <div style={S.mpHead}>
          <div style={{ ...S.aTag, color:a.color, background:a.colorDim, border:`1px solid ${a.colorBorder}`, display:'inline-block', marginBottom:'14px' }}>
            {L(a.tag, lang)}
          </div>
          <h2 style={S.greetName}>{a.icon} {L(a.label, lang)}</h2>
          <p style={S.greetSub}>{t.chooseTutor}</p>
        </div>
        <div style={S.mGrid}>
          {a.methods.map(m => <MethodCard key={m.id} method={m} onOpen={onOpen} lang={lang} />)}
        </div>
      </div>
    </div>
  )
}

/* ── Activity Frame ───────────────────────────────────────────────────────── */
function ActivityFrame({ file }) {
  return <iframe key={file} src={file} title="Activity" style={S.frame} />
}

/* ── Feedback Button + Modal ──────────────────────────────────────────────── */
function FeedbackButton({ user, currentPage, lang }) {
  const t       = LANGS[lang]
  const fbTypes = getFbTypes(t)

  const [open,    setOpen]    = useState(false)
  const [type,    setType]    = useState('suggestion')
  const [message, setMessage] = useState('')
  const [status,  setStatus]  = useState(null) // null | 'sending' | 'sent' | 'error'

  async function handleSubmit() {
    if (!message.trim()) return
    setStatus('sending')
    const ok = await submitFeedback({
      studentName:  user.displayName || 'Anonymous',
      studentEmail: user.email || '',
      type, message: message.trim(), page: currentPage,
    })
    setStatus(ok ? 'sent' : 'error')
    if (ok) setTimeout(() => { setOpen(false); setMessage(''); setType('suggestion'); setStatus(null) }, 1600)
  }

  function close() { setOpen(false); setMessage(''); setType('suggestion'); setStatus(null) }

  const selType = fbTypes.find(x => x.id === type)

  return (
    <>
      {/* Floating button */}
      <button style={S.fbFloatBtn} onClick={() => setOpen(true)} title={t.fbTitle}>
        <span style={{ fontSize:'1.1rem' }}>💬</span>
        <span style={{ fontFamily:"'Inter',sans-serif", fontSize:'.72rem', fontWeight:700, letterSpacing:'.3px' }}>
          {t.fbBtn}
        </span>
      </button>

      {/* Modal overlay */}
      {open && (
        <div style={S.fbOverlay} onClick={e => { if (e.target === e.currentTarget) close() }}>
          <div style={S.fbModal}>

            {/* Header */}
            <div style={S.fbModalHead}>
              <div>
                <h3 style={S.fbTitle}>{t.fbTitle}</h3>
                <p style={S.fbSubtitle}>{t.fbSub}</p>
              </div>
              <button style={S.fbClose} onClick={close}>✕</button>
            </div>

            {/* Type selector */}
            <div style={{ marginBottom:'16px' }}>
              <p style={S.fbLabel}>{t.fbTypeQ}</p>
              <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                {fbTypes.map(ft => (
                  <button key={ft.id} onClick={() => setType(ft.id)} style={{
                    padding:'7px 14px', borderRadius:'20px', cursor:'pointer',
                    border: `1.5px solid ${type === ft.id ? ft.border : 'rgba(255,255,255,0.1)'}`,
                    background: type === ft.id ? ft.dim : 'rgba(255,255,255,0.03)',
                    color:      type === ft.id ? ft.color : '#6b7a9a',
                    fontFamily:"'Inter',sans-serif", fontSize:'.82rem', fontWeight:700,
                    transition:'all .15s',
                  }}>{ft.label}</button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div style={{ marginBottom:'12px' }}>
              <p style={S.fbLabel}>
                {type === 'bug' ? t.fbBugQ : t.fbGenQ}
              </p>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder={type === 'bug' ? t.fbBugP : t.fbGenP}
                style={S.fbTextarea}
                rows={4}
              />
            </div>

            {/* Context */}
            <p style={{ fontSize:'.74rem', color:'#6b7a9a', fontFamily:"'Inter',sans-serif", marginBottom:'18px' }}>
              📍 {t.fbPage}: <strong style={{ color:'#ede9f4' }}>{currentPage}</strong>
              &nbsp;·&nbsp; {t.fbStudent}: <strong style={{ color:'#ede9f4' }}>{user.displayName || user.email}</strong>
            </p>

            {/* Actions */}
            {status === 'error' && (
              <p style={{ color:'#f87171', fontSize:'.82rem', marginBottom:'10px', fontFamily:"'Inter',sans-serif" }}>
                {t.errConn}
              </p>
            )}
            <div style={{ display:'flex', gap:'10px', justifyContent:'flex-end' }}>
              <button onClick={close} style={S.fbCancel}>{t.cancel}</button>
              <button
                onClick={handleSubmit}
                disabled={!message.trim() || status === 'sending' || status === 'sent'}
                style={{
                  ...S.fbSubmit,
                  background: status === 'sent' ? '#34d399' : (selType?.dim || 'rgba(232,168,50,0.15)'),
                  borderColor: status === 'sent' ? '#34d399' : (selType?.border || 'rgba(232,168,50,0.35)'),
                  color: status === 'sent' ? '#fff' : (selType?.color || '#e8a832'),
                  opacity: !message.trim() || status === 'sending' ? .55 : 1,
                }}
              >
                {status === 'sending' ? t.sending : status === 'sent' ? t.sent : t.submit}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/* ── Empty State ──────────────────────────────────────────────────────────── */
function EmptyState({ msg }) {
  return (
    <div style={{ textAlign:'center', width:'100%', paddingTop:'60px' }}>
      <div style={{ fontSize:'3rem', marginBottom:'16px' }}>📭</div>
      <p style={{ color:'#6b7a9a', fontFamily:"'Inter',sans-serif", fontSize:'1rem' }}>{msg}</p>
    </div>
  )
}

/* ── Rubric Modal ─────────────────────────────────────────────────────────── */
function RubricModal({ onClose }) {
  const dot = color => (
    <span style={{ display:'inline-block', width:'10px', height:'10px', borderRadius:'50%',
      background:color, boxShadow:`0 0 6px ${color}40`, flexShrink:0 }} />
  )

  const thresholds = rows => (
    <div style={{ background:'rgba(255,255,255,0.03)', borderRadius:'10px', padding:'12px 14px' }}>
      <p style={{ color:'#6b7a9a', fontSize:'.68rem', fontFamily:"'JetBrains Mono',monospace",
        fontWeight:700, letterSpacing:'1.2px', textTransform:'uppercase', marginBottom:'8px' }}>
        Grade Thresholds
      </p>
      {rows.map(([label, color, val]) => (
        <div key={label} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'6px 0',
          borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
          {dot(color)}
          <span style={{ color:'#ede9f4', fontSize:'.85rem', fontFamily:"'Inter',sans-serif", flex:1 }}>{label}</span>
          <span style={{ color, fontFamily:"'JetBrains Mono',monospace", fontSize:'.8rem', fontWeight:700 }}>{val}</span>
        </div>
      ))}
    </div>
  )

  const modBadge = (num, color, colorDim, colorBorder) => (
    <span style={{ background:colorDim, color, border:`1px solid ${colorBorder}`, borderRadius:'20px',
      padding:'3px 12px', fontFamily:"'JetBrains Mono',monospace",
      fontSize:'.62rem', fontWeight:700, letterSpacing:'1px', textTransform:'uppercase' }}>
      Module {num}
    </span>
  )

  return (
    <div style={S.fbOverlay} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ ...S.fbModal, maxWidth:'540px', maxHeight:'84vh', overflowY:'auto',
        display:'flex', flexDirection:'column' }}>

        <div style={{ ...S.fbModalHead, marginBottom:'20px' }}>
          <div>
            <h3 style={S.fbTitle}>📋 Scoring Rubric</h3>
            <p style={S.fbSubtitle}>How students are evaluated per module</p>
          </div>
          <button style={S.fbClose} onClick={onClose}>✕</button>
        </div>
        <div style={{ height:'1px', background:'rgba(255,255,255,0.07)', marginBottom:'24px' }} />

        {/* ── Module 2 · Systems of Equations ── */}
        <div style={{ marginBottom:'28px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'12px' }}>
            {modBadge(2, '#4fc3f7', 'rgba(79,195,247,0.12)', 'rgba(79,195,247,0.3)')}
            <span style={{ color:'#ede9f4', fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:'.95rem' }}>📈 Systems of Equations</span>
          </div>
          <p style={{ color:'#6b7a9a', fontSize:'.82rem', fontFamily:"'Inter',sans-serif", marginBottom:'14px', lineHeight:1.6 }}>
            Socratic tutor activity — each solving method graded independently via embedded quiz.
          </p>
          <table style={{ width:'100%', borderCollapse:'collapse', marginBottom:'12px',
            background:'rgba(255,255,255,0.02)', borderRadius:'10px', overflow:'hidden' }}>
            <thead><tr>
              <th style={{ ...S.th, textAlign:'left', paddingLeft:'14px' }}>Method</th>
              <th style={S.th}>Max</th>
              <th style={S.th}>Share</th>
            </tr></thead>
            <tbody>
              {[
                ['📈 Graphing',     '4 pts', '#4fc3f7', '33%'],
                ['🔁 Substitution', '4 pts', '#34d399', '33%'],
                ['➕ Elimination',  '4 pts', '#e8a832', '33%'],
                ['Total',           '12 pts', '#ede9f4', '100%'],
              ].map(([label, pts, color, pct], i) => (
                <tr key={label} style={{ borderTop:'1px solid rgba(255,255,255,0.04)',
                  background: i===3?'rgba(255,255,255,0.04)':i%2===0?'rgba(255,255,255,0.01)':'transparent' }}>
                  <td style={{ padding:'9px 14px', color:'#ede9f4', fontFamily:"'Inter',sans-serif", fontSize:'.86rem', fontWeight:i===3?700:400 }}>{label}</td>
                  <td style={{ padding:'9px 14px', textAlign:'center', color, fontFamily:"'JetBrains Mono',monospace", fontWeight:700, fontSize:'.86rem' }}>{pts}</td>
                  <td style={{ padding:'9px 14px', textAlign:'center', color:'#6b7a9a', fontFamily:"'JetBrains Mono',monospace", fontSize:'.8rem' }}>{pct}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {thresholds([
            ['Proficient',    '#34d399', '≥ 75%  (9 – 12 pts)'],
            ['Developing',    '#e8a832', '≥ 50%  (6 – 8 pts)'],
            ['Needs Support', '#f87171', '< 50%  (< 6 pts)'],
          ])}
        </div>

        {/* ── Module 2 · Systems of Inequalities ── */}
        <div style={{ marginBottom:'28px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'12px' }}>
            {modBadge(2, '#a78bfa', 'rgba(167,139,250,0.12)', 'rgba(167,139,250,0.3)')}
            <span style={{ color:'#ede9f4', fontFamily:"'JetBrains Mono',monospace", fontWeight:700, fontSize:'.95rem' }}>≥ Systems of Inequalities</span>
          </div>
          <p style={{ color:'#6b7a9a', fontSize:'.82rem', fontFamily:"'Inter',sans-serif", marginBottom:'14px', lineHeight:1.6 }}>
            Practice activity — scored as percentage of questions answered correctly.
          </p>
          {thresholds([
            ['Proficient',    '#34d399', '≥ 75% correct'],
            ['Developing',    '#e8a832', '≥ 50% correct'],
            ['Needs Support', '#f87171', '< 50% correct'],
          ])}
        </div>

        {/* ── Module 3 · M3T1L1 Exponential Functions HW ── */}
        <div style={{ marginBottom:'28px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'12px' }}>
            {modBadge(3, '#D4681A', 'rgba(212,104,26,0.12)', 'rgba(212,104,26,0.3)')}
            <span style={{ color:'#ede9f4', fontFamily:"'JetBrains Mono',monospace", fontWeight:700, fontSize:'.95rem' }}>x² M3T1L1 · Exponential Functions HW</span>
          </div>
          <p style={{ color:'#6b7a9a', fontSize:'.82rem', fontFamily:"'Inter',sans-serif", marginBottom:'14px', lineHeight:1.6 }}>
            Homework — XP earned across three sections. Grade = (XP ÷ 170) × 100.
          </p>
          <table style={{ width:'100%', borderCollapse:'collapse', marginBottom:'12px',
            background:'rgba(255,255,255,0.02)', borderRadius:'10px', overflow:'hidden' }}>
            <thead><tr>
              <th style={{ ...S.th, textAlign:'left', paddingLeft:'14px' }}>Section</th>
              <th style={S.th}>Activity</th>
              <th style={{ ...S.th, color:'#e8a832' }}>XP Pool</th>
            </tr></thead>
            <tbody>
              {[
                ['A1', 'Vocabulary Practice', '#4fc3f7'],
                ['A2', 'Fill-In Practice',    '#34d399'],
                ['A3', 'Graph Practice',      '#a78bfa'],
              ].map(([sec, label, color], i) => (
                <tr key={sec} style={{ borderTop:'1px solid rgba(255,255,255,0.04)',
                  background: i%2===0?'rgba(255,255,255,0.01)':'transparent' }}>
                  <td style={{ padding:'9px 14px', color, fontFamily:"'JetBrains Mono',monospace", fontWeight:700, fontSize:'.86rem' }}>{sec}</td>
                  <td style={{ padding:'9px 14px', color:'#ede9f4', fontFamily:"'Inter',sans-serif", fontSize:'.86rem' }}>{label}</td>
                  <td style={{ padding:'9px 14px', textAlign:'center', color:'#e8a832', fontFamily:"'JetBrains Mono',monospace", fontSize:'.8rem' }}>→ Total / 170</td>
                </tr>
              ))}
              <tr style={{ borderTop:'1px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.03)' }}>
                <td colSpan={2} style={{ padding:'9px 14px', color:'#ede9f4', fontFamily:"'Inter',sans-serif", fontWeight:700, fontSize:'.86rem' }}>Max XP</td>
                <td style={{ padding:'9px 14px', textAlign:'center', color:'#e8a832', fontFamily:"'JetBrains Mono',monospace", fontWeight:800 }}>170 XP</td>
              </tr>
            </tbody>
          </table>
          {thresholds([
            ['Refining',    '#34d399', '100%  (170 XP)'],
            ['Developing',  '#60a5fa', '≥ 85%  (145+ XP)'],
            ['Approaching', '#e8a832', '≥ 65%  (111+ XP)'],
            ['Emerging',    '#fb923c', '≥ 55%  ( 94+ XP)'],
            ['Missing',     '#f87171', '< 55%  (< 94 XP)'],
          ])}
        </div>

        {/* ── Module 3 · M3T1L2 Writing Exponential Functions ── */}
        <div style={{ marginBottom:'28px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'12px' }}>
            {modBadge(3, '#a78bfa', 'rgba(167,139,250,0.12)', 'rgba(167,139,250,0.3)')}
            <span style={{ color:'#ede9f4', fontFamily:"'JetBrains Mono',monospace", fontWeight:700, fontSize:'.95rem' }}>x² M3T1L2 · Writing Exponential Functions</span>
          </div>
          <p style={{ color:'#6b7a9a', fontSize:'.82rem', fontFamily:"'Inter',sans-serif", marginBottom:'14px', lineHeight:1.6 }}>
            10 questions · 4 parts each · Grade = (XP ÷ 400) × 100, capped at 100%.
          </p>
          <table style={{ width:'100%', borderCollapse:'collapse', marginBottom:'12px',
            background:'rgba(255,255,255,0.02)', borderRadius:'10px', overflow:'hidden' }}>
            <thead><tr>
              <th style={{ ...S.th, textAlign:'left', paddingLeft:'14px' }}>Part</th>
              <th style={S.th}>Task</th>
              <th style={{ ...S.th, color:'#e8a832' }}>XP</th>
            </tr></thead>
            <tbody>
              {[
                ['G/D', 'Growth or Decay',    '#4fc3f7', '+5 / −3'],
                ['a',   'Initial Value',       '#34d399', '+10 / −2'],
                ['b',   'Growth Factor',       '#e8a832', '+10 / −2'],
                ['Eq',  'Write Equation',      '#a78bfa', '+15 / −3'],
              ].map(([part, label, color, xp], i) => (
                <tr key={part} style={{ borderTop:'1px solid rgba(255,255,255,0.04)',
                  background: i%2===0?'rgba(255,255,255,0.01)':'transparent' }}>
                  <td style={{ padding:'9px 14px', color, fontFamily:"'JetBrains Mono',monospace", fontWeight:700, fontSize:'.86rem' }}>{part}</td>
                  <td style={{ padding:'9px 14px', color:'#ede9f4', fontFamily:"'Inter',sans-serif", fontSize:'.86rem' }}>{label}</td>
                  <td style={{ padding:'9px 14px', textAlign:'center', color:'#e8a832', fontFamily:"'JetBrains Mono',monospace", fontSize:'.8rem' }}>{xp}</td>
                </tr>
              ))}
              <tr style={{ borderTop:'1px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.03)' }}>
                <td colSpan={2} style={{ padding:'9px 14px', color:'#ede9f4', fontFamily:"'Inter',sans-serif", fontWeight:700, fontSize:'.86rem' }}>Max XP (10 questions)</td>
                <td style={{ padding:'9px 14px', textAlign:'center', color:'#e8a832', fontFamily:"'JetBrains Mono',monospace", fontWeight:800 }}>400 XP</td>
              </tr>
            </tbody>
          </table>
          {thresholds([
            ['Refining',    '#34d399', '100%  (400 XP)'],
            ['Developing',  '#60a5fa', '≥ 85%  (340+ XP)'],
            ['Approaching', '#e8a832', '≥ 65%  (260+ XP)'],
            ['Emerging',    '#fb923c', '≥ 55%  (220+ XP)'],
            ['Missing',     '#f87171', '< 55%  (< 220 XP)'],
          ])}
        </div>

        {/* ── Module 3 · M3T2 Exp Growth & Decay Skills Practice ── */}
        <div style={{ marginBottom:'8px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'12px' }}>
            {modBadge(3, '#34d399', 'rgba(52,211,153,0.12)', 'rgba(52,211,153,0.3)')}
            <span style={{ color:'#ede9f4', fontFamily:"'JetBrains Mono',monospace", fontWeight:700, fontSize:'.95rem' }}>x² M3T2 · Exp Growth & Decay Word Problems</span>
          </div>
          <p style={{ color:'#6b7a9a', fontSize:'.82rem', fontFamily:"'Inter',sans-serif", marginBottom:'14px', lineHeight:1.6 }}>
            5 population word problems · 4 parts each · Grade = (XP ÷ 200) × 100, capped at 100%.
          </p>
          <table style={{ width:'100%', borderCollapse:'collapse', marginBottom:'12px',
            background:'rgba(255,255,255,0.02)', borderRadius:'10px', overflow:'hidden' }}>
            <thead><tr>
              <th style={{ ...S.th, textAlign:'left', paddingLeft:'14px' }}>Part</th>
              <th style={S.th}>Task</th>
              <th style={{ ...S.th, color:'#e8a832' }}>XP</th>
            </tr></thead>
            <tbody>
              {[
                ['G/D', 'Growth or Decay',    '#4fc3f7', '+5 / −3'],
                ['a',   'Initial Value',       '#34d399', '+10 / −2'],
                ['b',   'Growth Factor',       '#e8a832', '+10 / −2'],
                ['Eq',  'Write Equation',      '#a78bfa', '+15 / −3'],
              ].map(([part, label, color, xp], i) => (
                <tr key={part} style={{ borderTop:'1px solid rgba(255,255,255,0.04)',
                  background: i%2===0?'rgba(255,255,255,0.01)':'transparent' }}>
                  <td style={{ padding:'9px 14px', color, fontFamily:"'JetBrains Mono',monospace", fontWeight:700, fontSize:'.86rem' }}>{part}</td>
                  <td style={{ padding:'9px 14px', color:'#ede9f4', fontFamily:"'Inter',sans-serif", fontSize:'.86rem' }}>{label}</td>
                  <td style={{ padding:'9px 14px', textAlign:'center', color:'#e8a832', fontFamily:"'JetBrains Mono',monospace", fontSize:'.8rem' }}>{xp}</td>
                </tr>
              ))}
              <tr style={{ borderTop:'1px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.03)' }}>
                <td colSpan={2} style={{ padding:'9px 14px', color:'#ede9f4', fontFamily:"'Inter',sans-serif", fontWeight:700, fontSize:'.86rem' }}>Max XP (5 questions)</td>
                <td style={{ padding:'9px 14px', textAlign:'center', color:'#e8a832', fontFamily:"'JetBrains Mono',monospace", fontWeight:800 }}>200 XP</td>
              </tr>
            </tbody>
          </table>
          {thresholds([
            ['Refining',    '#34d399', '100%  (200 XP)'],
            ['Developing',  '#60a5fa', '≥ 85%  (170+ XP)'],
            ['Approaching', '#e8a832', '≥ 65%  (130+ XP)'],
            ['Emerging',    '#fb923c', '≥ 55%  (110+ XP)'],
            ['Missing',     '#f87171', '< 55%  (< 110 XP)'],
          ])}
        </div>

      </div>
    </div>
  )
}

/* ── Grade helpers (Rubric) ───────────────────────────────────────────────── */
const RUBRIC = [
  { label:'Refining',   pct:100, color:'#34d399', dim:'rgba(52,211,153,0.12)',  border:'rgba(52,211,153,0.35)'  },
  { label:'Developing', pct:85,  color:'#60a5fa', dim:'rgba(96,165,250,0.12)',  border:'rgba(96,165,250,0.35)'  },
  { label:'Approaching',pct:65,  color:'#e8a832', dim:'rgba(232,168,50,0.12)',  border:'rgba(232,168,50,0.35)'  },
  { label:'Emerging',   pct:55,  color:'#fb923c', dim:'rgba(251,146,60,0.12)',  border:'rgba(251,146,60,0.35)'  },
  { label:'Missing',    pct:0,   color:'#f87171', dim:'rgba(248,113,113,0.12)', border:'rgba(248,113,113,0.35)' },
]
const rubricFor  = pct => RUBRIC.find(r => pct >= r.pct) || RUBRIC[RUBRIC.length-1]

/* ── Student Detail Modal ─────────────────────────────────────────────────── */
function StudentDetailModal({ row, tab, onClose }) {
  if (!row) return null
  const xpEarned = row.xp ?? 0

  // Determine maxXP and rubric level
  const maxXP = tab === 'writing-exp' ? 400 : tab === 'm3t2sp' ? 200 : row.maxXP || 170
  const pct = Math.min(100, Math.round(xpEarned / maxXP * 100))
  const rubric = rubricFor(pct)

  // Question/part labels
  const PART_LABELS = { gdDone:'Growth/Decay', aDone:'Initial Value (a)', bDone:'Growth Factor (b)', eqDone:'Equation' }
  const PART_XP     = { gdDone:5, aDone:10, bDone:10, eqDone:15 }

  return (
    <div style={S.fbOverlay} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ ...S.fbModal, maxWidth:'580px', maxHeight:'86vh', overflowY:'auto', display:'flex', flexDirection:'column' }}>

        {/* Header */}
        <div style={{ ...S.fbModalHead, marginBottom:'16px' }}>
          <div>
            <h3 style={S.fbTitle}>📋 {row.student}'s Submission</h3>
            <p style={S.fbSubtitle}>
              {tab === 'exponential' ? 'M3T1L1 · Intro to Exponential Functions' :
               tab === 'writing-exp' ? 'M3T1L2 · Writing Exponential Functions' :
               'M3T2 · Exponential Growth & Decay'}
            </p>
          </div>
          <button style={S.fbClose} onClick={onClose}>✕</button>
        </div>

        {/* Score summary bar */}
        <div style={{ display:'flex', gap:'12px', marginBottom:'20px', flexWrap:'wrap' }}>
          <div style={{ flex:1, minWidth:'100px', background:rubric.dim, border:`1px solid ${rubric.border}`, borderRadius:'14px', padding:'14px 16px', textAlign:'center' }}>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:800, fontSize:'1.5rem', color:rubric.color }}>{rubric.label}</div>
            <div style={{ fontFamily:"'Inter',sans-serif", fontSize:'.75rem', color:'#6b7a9a', marginTop:'2px' }}>Level</div>
          </div>
          <div style={{ flex:1, minWidth:'100px', background:'rgba(232,168,50,0.08)', border:'1px solid rgba(232,168,50,0.25)', borderRadius:'14px', padding:'14px 16px', textAlign:'center' }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontWeight:800, fontSize:'1.3rem', color:'#e8a832' }}>{xpEarned}<span style={{ fontSize:'.8rem', color:'#6b7a9a', fontWeight:400 }}>/{maxXP}</span></div>
            <div style={{ fontFamily:"'Inter',sans-serif", fontSize:'.75rem', color:'#6b7a9a', marginTop:'2px' }}>XP</div>
          </div>
          <div style={{ flex:1, minWidth:'100px', background:rubric.dim, border:`1px solid ${rubric.border}`, borderRadius:'14px', padding:'14px 16px', textAlign:'center' }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontWeight:800, fontSize:'1.3rem', color:rubric.color }}>{pct}%</div>
            <div style={{ fontFamily:"'Inter',sans-serif", fontSize:'.75rem', color:'#6b7a9a', marginTop:'2px' }}>Score</div>
          </div>
        </div>

        <div style={{ height:'1px', background:'rgba(255,255,255,0.07)', marginBottom:'16px' }} />

        {/* M3T1L1 Exponential HW breakdown */}
        {tab === 'exponential' && (
          <div>
            <p style={{ ...S.fbLabel, marginBottom:'12px' }}>Section Completion</p>
            {['a1','a2','a3'].map(sec => (
              <div key={sec} style={{ display:'flex', alignItems:'center', gap:'12px', padding:'10px 14px', background:'rgba(255,255,255,0.03)', borderRadius:'10px', marginBottom:'8px' }}>
                <span style={{ fontFamily:"'JetBrains Mono',monospace", fontWeight:700, fontSize:'.9rem', color:row.completed?.[sec]?'#34d399':'#f87171', minWidth:'32px' }}>
                  {sec.toUpperCase()}
                </span>
                <span style={{ color:'#ede9f4', fontFamily:"'Inter',sans-serif", fontSize:'.88rem', flex:1 }}>
                  { sec==='a1'?'Vocabulary Practice':sec==='a2'?'Fill-In Practice':'Graph Practice' }
                </span>
                <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'.8rem', color:row.completed?.[sec]?'#34d399':'#6b7a9a' }}>
                  {row.completed?.[sec] ? '✅ Complete' : '⬜ Not done'}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* M3T1L2 / M3T2SP: per-question progress breakdown */}
        {(tab === 'writing-exp' || tab === 'm3t2sp') && row.progress && (
          <div>
            <p style={{ ...S.fbLabel, marginBottom:'12px' }}>Question Breakdown</p>
            {Object.entries(row.progress).sort(([a],[b]) => a.localeCompare(b)).map(([qId, p]) => {
              const qEarned  = p.earned  ?? 0
              const qPenalty = p.penalty ?? 0
              const qNet     = qEarned - qPenalty
              const allDone  = p.gdDone && p.aDone && p.bDone && p.eqDone
              return (
                <div key={qId} style={{ marginBottom:'10px', background:'rgba(255,255,255,0.03)', borderRadius:'12px', padding:'12px 14px', border:'1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px' }}>
                    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontWeight:700, fontSize:'.82rem', color:'#a78bfa' }}>{qId}</span>
                    <span style={{ flex:1 }} />
                    {qEarned > 0 && <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'.75rem', color:'#34d399' }}>+{qEarned} XP</span>}
                    {qPenalty > 0 && <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'.75rem', color:'#f87171' }}>−{qPenalty} XP</span>}
                    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'.82rem', fontWeight:700, color: qNet>0?'#e8a832':'#6b7a9a' }}>Net: {qNet >= 0 ? '+' : ''}{qNet}</span>
                  </div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
                    {Object.entries(PART_LABELS).map(([key, label]) => {
                      const done = p[key]
                      return (
                        <span key={key} style={{
                          padding:'3px 10px', borderRadius:'20px', fontSize:'.72rem', fontWeight:600,
                          fontFamily:"'JetBrains Mono',monospace",
                          background: done ? 'rgba(52,211,153,0.12)' : 'rgba(255,255,255,0.05)',
                          color:      done ? '#34d399' : '#6b7a9a',
                          border:`1px solid ${done ? 'rgba(52,211,153,0.3)' : 'rgba(255,255,255,0.08)'}`,
                        }}>
                          {done ? '✓' : '○'} {label} (+{PART_XP[key]})
                        </span>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Rubric reference */}
        <div style={{ height:'1px', background:'rgba(255,255,255,0.07)', margin:'12px 0' }} />
        <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
          {RUBRIC.map(r => (
            <span key={r.label} style={{ padding:'3px 10px', borderRadius:'20px', fontSize:'.7rem', fontWeight:700, fontFamily:"'JetBrains Mono',monospace", background:r.dim, color:r.color, border:`1px solid ${r.border}`, opacity: rubric.label === r.label ? 1 : 0.45 }}>
              {r.label} ≥{r.pct}%
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Teacher Dashboard ────────────────────────────────────────────────────── */
function TeacherDashboard() {
  const [rows,        setRows]        = useState(null)
  const [ineqRows,    setIneqRows]    = useState(null)
  const [hwRows,      setHwRows]      = useState(null)
  const [wefRows,     setWefRows]     = useState(null)
  const [m3t2spRows,  setM3t2spRows]  = useState(null)
  const [fbRows,      setFbRows]      = useState(null)
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [tab,          setTab]          = useState('systems')
  const [selectedRow,  setSelectedRow]  = useState(null)
  const [periodFilter, setPeriodFilter] = useState('all')
  const [periodByEmail, setPeriodByEmail] = useState({}) // email → period
  const [periodByName,  setPeriodByName]  = useState({}) // displayName.lower → period
  const [fbFilter,   setFbFilter]   = useState('all')
  const [showRubric, setShowRubric] = useState(false)

  function exportCSV() {
    if (tab === 'systems' && rows?.length) {
      const hdrs = ['Student','Email','Period','Graphing Score','Graphing Max','Substitution Score','Substitution Max','Elimination Score','Elimination Max','Total (/12)','% Score']
      const data = filterByPeriod(rows).map(r => {
        const total = (r.graphing?.score||0)+(r.substitution?.score||0)+(r.elimination?.score||0)
        return [r.displayName||r.email, r.email, getPeriod(r)||'', r.graphing?.score??'', r.graphing?.total??'', r.substitution?.score??'', r.substitution?.total??'', r.elimination?.score??'', r.elimination?.total??'', total, Math.round(total/12*100)+'%']
      })
      downloadCSV('systems-equations-scores.csv', [hdrs, ...data])
    } else if (tab === 'inequalities' && ineqRows?.length) {
      const actKeys = Array.from(new Set(ineqRows.flatMap(r => Object.keys(r).filter(k => k !== 'email' && k !== 'displayName'))))
      const hdrs = ['Student','Email','Period', ...actKeys.flatMap(k => [k+' Score', k+' Max']),'% Score']
      const data = filterByPeriod(ineqRows).map(r => {
        const rActKeys = Object.keys(r).filter(k => k !== 'email' && k !== 'displayName')
        const totalScore = rActKeys.reduce((s,k) => s+(r[k]?.score||0), 0)
        const totalMax   = rActKeys.reduce((s,k) => s+(r[k]?.total||0), 0)
        const pct = totalMax > 0 ? Math.round(totalScore/totalMax*100) : 0
        return [r.displayName||r.email, r.email, getPeriod(r)||'', ...actKeys.flatMap(k => [r[k]?.score??'', r[k]?.total??'']), totalMax>0?pct+'%':'']
      })
      downloadCSV('systems-inequalities-scores.csv', [hdrs, ...data])
    } else if (tab === 'exponential' && hwRows?.length) {
      const hdrs = ['Student','Period','Grade','% Score','XP Total','Max XP','A1 Vocab','A2 Fill-In','A3 Graph','Submitted At']
      const data = filterByPeriod(hwRows).map(r => {
        const xpTotal = r.xp?.total ?? r.grade ?? 0
        const pct = Math.min(100, Math.round(xpTotal / (r.maxXP||170) * 100))
        const rub = rubricFor(pct)
        const ts = r.submitTimestamp||r.timestamp
        const ds = ts ? new Date(ts).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric',hour:'2-digit',minute:'2-digit'}) : ''
        return [r.student, getPeriod(r)||'', rub.label, pct+'%', r.xp?.total??'', r.maxXP||170, r.completed?.a1?'Yes':'No', r.completed?.a2?'Yes':'No', r.completed?.a3?'Yes':'No', ds]
      })
      downloadCSV('exponential-homework-scores.csv', [hdrs, ...data])
    } else if (tab === 'writing-exp' && wefRows?.length) {
      const hdrs = ['Student','Period','Grade','XP Earned','Max XP (400)','% Score','Questions Completed','Submitted At']
      const data = filterByPeriod(wefRows).map(r => {
        const ts = r.submitTimestamp||r.timestamp
        const ds = ts ? new Date(ts).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric',hour:'2-digit',minute:'2-digit'}) : ''
        const xpEarned = r.xp ?? 0
        const pct = Math.min(100, Math.round(xpEarned / 400 * 100))
        const rub = rubricFor(pct)
        const done = r.progress ? Object.values(r.progress).filter(p => p.aDone && p.bDone).length : 0
        return [r.student, getPeriod(r)||'', rub.label, xpEarned, 400, pct + '%', done + ' / 10', ds]
      })
      downloadCSV('writing-exponential-functions-scores.csv', [hdrs, ...data])
    } else if (tab === 'm3t2sp' && m3t2spRows?.length) {
      const hdrs = ['Student','Period','Grade','XP Earned','Max XP (200)','% Score','Questions Completed','Submitted At']
      const data = filterByPeriod(m3t2spRows).map(r => {
        const ts = r.submitTimestamp||r.timestamp
        const ds = ts ? new Date(ts).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric',hour:'2-digit',minute:'2-digit'}) : ''
        const xpEarned = r.xp ?? 0
        const pct = Math.min(100, Math.round(xpEarned / 200 * 100))
        const rub = rubricFor(pct)
        const done = r.progress ? Object.keys(r.progress).filter(k => r.progress[k].eqDone).length : 0
        return [r.student, getPeriod(r)||'', rub.label, xpEarned, 200, pct + '%', done + ' / 5', ds]
      })
      downloadCSV('exp-growth-decay-skills-practice-scores.csv', [hdrs, ...data])
    }
  }

  useEffect(() => {
    setLoading(true); setError(null)
    Promise.all([
      getDocs(collection(db,'scores')),
      getDocs(collection(db,'homework')),
      getDocs(collection(db,'feedback')),
      getDocs(collection(db,'students')),
    ])
      .then(([sSnap, hSnap, fSnap, studSnap]) => {
        // Build period maps from students collection
        const pByEmail = {}, pByName = {}
        studSnap.docs.forEach(d => {
          const { email, displayName, period } = d.data()
          if (email && period) { pByEmail[email] = period }
          if (displayName && period) { pByName[displayName.trim().toLowerCase()] = period }
        })
        setPeriodByEmail(pByEmail)
        setPeriodByName(pByName)
        // Systems of Equations scores (graphing / substitution / elimination)
        const byStudent = {}
        // Inequalities scores (activity contains 'inequal')
        const ineqByStudent = {}

        sSnap.docs.forEach(d => {
          const { email, displayName, activity, score, total } = d.data()
          if (!activity) return

          if (['graphing','substitution','elimination'].includes(activity)) {
            if (!byStudent[email])
              byStudent[email] = { email, displayName, graphing:null, substitution:null, elimination:null }
            byStudent[email][activity] = { score, total }
          } else if (activity.toLowerCase().includes('inequal')) {
            if (!ineqByStudent[email])
              ineqByStudent[email] = { email, displayName }
            ineqByStudent[email][activity] = { score, total }
          }
        })

        const nameOf = r => (r.displayName || r.email || '').toLowerCase()
        setRows(Object.values(byStudent).sort((a,b) => nameOf(a).localeCompare(nameOf(b))))
        setIneqRows(Object.values(ineqByStudent).sort((a,b) => nameOf(a).localeCompare(nameOf(b))))

        // Homework scores — helper to deduplicate by student name
        const buildHwMap = (module) => {
          const hwMap = {}
          hSnap.docs.forEach(d => {
            const row = d.data()
            if (row.module !== module) return
            if (!row.student || !row.student.trim()) return
            const key = row.student.trim().toLowerCase()
            const existing = hwMap[key]
            if (!existing) { hwMap[key] = row; return }
            if (row.submitted && !existing.submitted) { hwMap[key] = row; return }
            if (!row.submitted && existing.submitted) return
            const rowTs  = row.submitTimestamp  || row.timestamp  || 0
            const exstTs = existing.submitTimestamp || existing.timestamp || 0
            if (rowTs > exstTs) hwMap[key] = row
          })
          return Object.values(hwMap).filter(r => r.submitted).sort((a,b) => (a.student||'').localeCompare(b.student||''))
        }
        setHwRows(buildHwMap('M3T1L1'))
        setWefRows(buildHwMap('M3T1L2'))
        setM3t2spRows(buildHwMap('M3T2_SkillsPractice'))

        // Feedback — sorted newest first
        const fbData = fSnap.docs.map(d => ({ id:d.id, ...d.data() }))
          .sort((a,b) => (b.timestamp?.seconds||0) - (a.timestamp?.seconds||0))
        setFbRows(fbData)
      })
      .catch(e => { console.error(e); setError('Could not load data. Check your Firestore rules.') })
      .finally(() => setLoading(false))
  }, [refreshKey])

  const cellColor = s => !s ? '#6b7a9a' : s.score/s.total >= .75 ? '#34d399' : s.score/s.total >= .5 ? '#e8a832' : '#f87171'
  const fmt       = s => s ? `${s.score} / ${s.total}` : '—'

  const unreadCount = fbRows?.filter(r => !r.read).length || 0

  const TABS = [
    { id:'systems',     label:'📈 Systems of Equations',   color:'#4fc3f7', dim:'rgba(79,195,247,0.12)',  border:'rgba(79,195,247,0.35)'  },
    { id:'inequalities',label:'≥ Systems of Inequalities', color:'#a78bfa', dim:'rgba(167,139,250,0.12)', border:'rgba(167,139,250,0.35)', isMath:true },
    { id:'exponential', label:'x² Introduction to Exponential Functions', color:'#D4681A', dim:'rgba(212,104,26,0.12)', border:'rgba(212,104,26,0.35)', isMath:true },
    { id:'writing-exp', label:'x² Writing Exponential Functions',         color:'#a78bfa', dim:'rgba(167,139,250,0.12)', border:'rgba(167,139,250,0.35)', isMath:true },
    { id:'m3t2sp',      label:'x² Exp Growth & Decay',                   color:'#34d399', dim:'rgba(52,211,153,0.12)',  border:'rgba(52,211,153,0.35)',  isMath:true },
    { id:'feedback',    label:'💬 Feedback',                color:'#e8a832', dim:'rgba(232,168,50,0.12)',  border:'rgba(232,168,50,0.35)',  badge: unreadCount },
  ]

  // Period filter helpers
  const getPeriod = (r) => periodByEmail[r.email] || periodByName[(r.displayName||r.student||'').trim().toLowerCase()] || ''
  const allPeriods = [...new Set(
    [...Object.values(periodByEmail), ...Object.values(periodByName)]
  )].filter(Boolean).sort((a,b) => Number(a)-Number(b))
  const filterByPeriod = (rows) => periodFilter === 'all' ? rows : rows.filter(r => getPeriod(r) === periodFilter)

  const filteredFb = fbRows?.filter(r => fbFilter === 'all' || r.type === fbFilter) || []
  const FB_TYPES_DASH = [
    { id:'bug',        label:'🐛 Bug Found',  color:'#f87171', dim:'rgba(248,113,113,0.12)', border:'rgba(248,113,113,0.3)' },
    { id:'suggestion', label:'💡 Suggestion', color:'#e8a832', dim:'rgba(232,168,50,0.12)',  border:'rgba(232,168,50,0.3)'  },
    { id:'general',    label:'👍 General',    color:'#34d399', dim:'rgba(52,211,153,0.12)',  border:'rgba(52,211,153,0.3)'  },
  ]

  return (
    <>
    <div style={S.scrollPage}>
      <div style={{ ...S.pageInner, alignItems:'flex-start' }}>

        {/* Header */}
        <div style={{ marginBottom:'28px' }}>
          <h2 style={{ ...S.greetName, fontSize:'clamp(1.4rem,3vw,2rem)', textAlign:'left', marginBottom:'6px' }}>
            📊 Teacher Dashboard
          </h2>
          <p style={{ ...S.greetSub, textAlign:'left', margin:0 }}>
            Miss Alvarado's Algebra World · <span style={{ color:'#34d399' }}>Live from Firebase</span>
          </p>
        </div>

        {/* Tab row */}
        <div style={{ display:'flex', gap:'8px', marginBottom:'28px', flexWrap:'wrap', alignItems:'center', width:'100%' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              ...S.tabBtn, position:'relative',
              background:  tab===t.id ? t.dim    : 'rgba(255,255,255,0.03)',
              borderColor: tab===t.id ? t.border : 'rgba(255,255,255,0.08)',
              color:       tab===t.id ? t.color  : '#6b7a9a',
              fontFamily:  t.isMath ? "'JetBrains Mono',monospace" : undefined,
            }}>
              {t.label}
              {t.badge > 0 && (
                <span style={{ position:'absolute', top:'-6px', right:'-6px', background:'#f87171', color:'#fff', borderRadius:'99px', fontSize:'.65rem', fontWeight:800, padding:'1px 6px', lineHeight:'1.4', fontFamily:"'JetBrains Mono',monospace" }}>
                  {t.badge}
                </span>
              )}
            </button>
          ))}
          <div style={{ marginLeft:'auto', display:'flex', gap:'8px', alignItems:'center' }}>
            <button onClick={() => setShowRubric(true)} style={{ ...S.tabBtn, color:'#a78bfa', borderColor:'rgba(167,139,250,0.3)', background:'rgba(167,139,250,0.08)' }}>
              📋 Rubric
            </button>
            {!loading && tab !== 'feedback' && (
              <button onClick={exportCSV} style={{ ...S.tabBtn, color:'#34d399', borderColor:'rgba(52,211,153,0.35)', background:'rgba(52,211,153,0.08)' }}>
                📥 Export CSV
              </button>
            )}
            <button style={{ ...S.tabBtn, color:'#6b7a9a', borderColor:'rgba(255,255,255,0.12)' }}
              onClick={() => setRefreshKey(k => k+1)}>
              ↻ Refresh
            </button>
          </div>
        </div>

        {/* Period filter tabs */}
        {allPeriods.length > 0 && (
          <div style={{ display:'flex', gap:'6px', marginBottom:'20px', flexWrap:'wrap', alignItems:'center' }}>
            <span style={{ fontSize:'.72rem', color:'#6b7a9a', fontFamily:"'JetBrains Mono',monospace", fontWeight:700, letterSpacing:'1px', textTransform:'uppercase', marginRight:'4px' }}>Period:</span>
            {['all', ...allPeriods].map(p => (
              <button key={p} onClick={() => setPeriodFilter(p)} style={{
                padding:'4px 12px', borderRadius:'20px', cursor:'pointer', fontFamily:"'JetBrains Mono',monospace", fontSize:'.75rem', fontWeight:700,
                background: periodFilter===p ? 'rgba(52,211,153,0.15)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${periodFilter===p ? 'rgba(52,211,153,0.45)' : 'rgba(255,255,255,0.08)'}`,
                color:  periodFilter===p ? '#34d399' : '#6b7a9a',
              }}>
                {p === 'all' ? 'All Periods' : `Period ${p}`}
              </button>
            ))}
          </div>
        )}

        {loading && <p style={{ color:'#6b7a9a', fontFamily:"'Inter',sans-serif" }}>Loading…</p>}
        {error   && <p style={{ color:'#f87171', background:'rgba(248,113,113,0.08)', border:'1px solid rgba(248,113,113,0.2)', padding:'12px 16px', borderRadius:'10px', fontFamily:"'Inter',sans-serif" }}>{error}</p>}

        {/* ── Systems of Equations ── */}
        {!loading && tab === 'systems' && (
          <div style={{ width:'100%' }}>
            <div style={S.dashSectionHead}>
              <span style={S.dashSectionTitle}>📈 Systems of Equations · Socratic Activity Scores</span>
              <span style={S.dashSectionSub}>{filterByPeriod(rows||[]).length} student{filterByPeriod(rows||[]).length !== 1 ? 's' : ''} · appears per method completed · green=75%+ · yellow=50%+ · red=below 50%</span>
            </div>
            {!rows?.length
              ? <EmptyState msg="No scores yet. Students appear here after completing each method." />
              : <div style={{ overflowX:'auto' }}>
                  <table style={S.table}>
                    <thead><tr>
                      <th style={{ ...S.th, textAlign:'left', paddingLeft:'16px' }}>Student</th>
                      <th style={{ ...S.th, color:'#a78bfa' }}>Period</th>
                      <th style={{ ...S.th, color:'#4fc3f7' }}>📈 Graphing</th>
                      <th style={{ ...S.th, color:'#34d399' }}>🔁 Substitution</th>
                      <th style={{ ...S.th, color:'#e8a832' }}>➕ Elimination</th>
                      <th style={S.th}>Total</th>
                      <th style={{ ...S.th, color:'#34d399' }}>% Score</th>
                    </tr></thead>
                    <tbody>
                      {filterByPeriod(rows).map((r,i) => {
                        const total=(r.graphing?.score||0)+(r.substitution?.score||0)+(r.elimination?.score||0)
                        const pct = Math.round(total/12*100)
                        const rub = rubricFor(pct)
                        const per = getPeriod(r)
                        return (
                          <tr key={r.email} style={{ ...S.tr, background: i%2===0?'rgba(255,255,255,0.015)':'transparent' }}>
                            <td style={S.tdName}>
                              <div style={{ fontWeight:600, color:'#ede9f4', fontSize:'.9rem' }}>{r.displayName}</div>
                              <div style={{ fontSize:'.72rem', color:'#6b7a9a', marginTop:'2px' }}>{r.email}</div>
                            </td>
                            <td style={{ ...S.td, color: per?'#a78bfa':'#6b7a9a', fontFamily:"'JetBrains Mono',monospace", fontWeight:per?700:400 }}>{per ? `P${per}` : '—'}</td>
                            <td style={{ ...S.td, color:cellColor(r.graphing),     fontWeight:r.graphing     ?600:400 }}>{fmt(r.graphing)}</td>
                            <td style={{ ...S.td, color:cellColor(r.substitution), fontWeight:r.substitution ?600:400 }}>{fmt(r.substitution)}</td>
                            <td style={{ ...S.td, color:cellColor(r.elimination),  fontWeight:r.elimination  ?600:400 }}>{fmt(r.elimination)}</td>
                            <td style={{ ...S.td, color:total>=9?'#34d399':total>=6?'#e8a832':'#f87171', fontWeight:700, fontSize:'1rem' }}>{total}/12</td>
                            <td style={{ ...S.td, color:rub.color, fontWeight:700, fontFamily:"'JetBrains Mono',monospace" }}>{pct}%</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                  <p style={{ color:'#6b7a9a', fontSize:'.74rem', marginTop:'10px', fontFamily:"'Inter',sans-serif", textAlign:'right' }}>
                    {filterByPeriod(rows).length} student{filterByPeriod(rows).length!==1?'s':''}
                  </p>
                </div>
            }
          </div>
        )}

        {/* ── Systems of Inequalities ── */}
        {!loading && tab === 'inequalities' && (
          <div style={{ width:'100%' }}>
            <div style={S.dashSectionHead}>
              <span style={S.dashSectionTitle}>≥ Systems of Inequalities · Activity Scores</span>
              <span style={S.dashSectionSub}>{filterByPeriod(ineqRows||[]).length} student{filterByPeriod(ineqRows||[]).length !== 1 ? 's' : ''} · one entry per student · appears after completing the activity</span>
            </div>
            {!ineqRows?.length
              ? <EmptyState msg="No scores yet. Students appear here after completing the inequalities activity." />
              : (() => {
                  const actKeys = Array.from(new Set(ineqRows.flatMap(r => Object.keys(r).filter(k => k !== 'email' && k !== 'displayName'))))
                  const filtered = filterByPeriod(ineqRows)
                  return (
                    <div style={{ overflowX:'auto' }}>
                      <table style={S.table}>
                        <thead><tr>
                          <th style={{ ...S.th, textAlign:'left', paddingLeft:'16px' }}>Student</th>
                          <th style={{ ...S.th, color:'#a78bfa' }}>Period</th>
                          {actKeys.map(act => (
                            <th key={act} style={{ ...S.th, color:'#a78bfa' }}>≥ {act}</th>
                          ))}
                          <th style={{ ...S.th, color:'#34d399' }}>% Score</th>
                        </tr></thead>
                        <tbody>
                          {filtered.map((r,i) => {
                            const rActKeys = Object.keys(r).filter(k => k !== 'email' && k !== 'displayName')
                            const totalScore = rActKeys.reduce((s,k) => s+(r[k]?.score||0), 0)
                            const totalMax   = rActKeys.reduce((s,k) => s+(r[k]?.total||0), 0)
                            const pct = totalMax > 0 ? Math.round(totalScore/totalMax*100) : 0
                            const rub = rubricFor(pct)
                            const per = getPeriod(r)
                            return (
                              <tr key={r.email} style={{ ...S.tr, background: i%2===0?'rgba(255,255,255,0.015)':'transparent' }}>
                                <td style={S.tdName}>
                                  <div style={{ fontWeight:600, color:'#ede9f4', fontSize:'.9rem' }}>{r.displayName}</div>
                                  <div style={{ fontSize:'.72rem', color:'#6b7a9a', marginTop:'2px' }}>{r.email}</div>
                                </td>
                                <td style={{ ...S.td, color: per?'#a78bfa':'#6b7a9a', fontFamily:"'JetBrains Mono',monospace", fontWeight:per?700:400 }}>{per ? `P${per}` : '—'}</td>
                                {actKeys.map(act => (
                                  <td key={act} style={{ ...S.td, color:cellColor(r[act]), fontWeight:r[act]?600:400 }}>{fmt(r[act])}</td>
                                ))}
                                <td style={{ ...S.td, color:rub.color, fontWeight:700, fontFamily:"'JetBrains Mono',monospace" }}>{totalMax > 0 ? `${pct}%` : '—'}</td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                      <p style={{ color:'#6b7a9a', fontSize:'.74rem', marginTop:'10px', fontFamily:"'Inter',sans-serif", textAlign:'right' }}>
                        {filtered.length} student{filtered.length!==1?'s':''}
                      </p>
                    </div>
                  )
                })()
            }
          </div>
        )}

        {/* ── Exponential Homework ── */}
        {!loading && tab === 'exponential' && (
          <div style={{ width:'100%' }}>
            <div style={S.dashSectionHead}>
              <span style={S.dashSectionTitle}>x² M3T1L1 · Introduction to Exponential Functions</span>
              <span style={S.dashSectionSub}>{filterByPeriod(hwRows||[]).length} student{filterByPeriod(hwRows||[]).length !== 1 ? 's' : ''} completed · name filled in &amp; submitted required to appear</span>
            </div>
            {!hwRows?.length
              ? <EmptyState msg="No completed submissions yet. Students appear here once they fill in their name and submit." />
              : <div style={{ overflowX:'auto' }}>
                  <table style={S.table}>
                    <thead><tr>
                      <th style={{ ...S.th, textAlign:'left', paddingLeft:'16px' }}>Student</th>
                      <th style={{ ...S.th, color:'#a78bfa' }}>Period</th>
                      <th style={{ ...S.th, color:'#D4681A' }}>Grade</th>
                      <th style={{ ...S.th, color:'#e8a832' }}>XP</th>
                      <th style={{ ...S.th, color:'#4fc3f7' }}>A1 Vocab</th>
                      <th style={{ ...S.th, color:'#34d399' }}>A2 Fill-In</th>
                      <th style={{ ...S.th, color:'#a78bfa' }}>A3 Graph</th>
                      <th style={S.th}>Submitted</th>
                    </tr></thead>
                    <tbody>
                      {filterByPeriod(hwRows).map((r,i) => {
                        const xpTotal = r.xp?.total ?? r.grade ?? 0
                        const pct = Math.min(100, Math.round(xpTotal / (r.maxXP||170) * 100))
                        const rub = rubricFor(pct)
                        const ts = r.submitTimestamp||r.timestamp
                        const ds = ts ? new Date(ts).toLocaleDateString('en-US',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}) : '—'
                        const per = getPeriod(r)
                        return (
                          <tr key={r.student+i} onClick={() => setSelectedRow({...r, _tab:'exponential'})} style={{ ...S.tr, background: i%2===0?'rgba(255,255,255,0.015)':'transparent', cursor:'pointer' }}>
                            <td style={S.tdName}><div style={{ fontWeight:600, color:'#ede9f4', fontSize:'.9rem' }}>{r.student}</div></td>
                            <td style={{ ...S.td, color: per?'#a78bfa':'#6b7a9a', fontFamily:"'JetBrains Mono',monospace", fontWeight:per?700:400 }}>{per ? `P${per}` : '—'}</td>
                            <td style={{ ...S.td, color:rub.color, fontWeight:700, fontSize:'.9rem' }}>{rub.label}</td>
                            <td style={{ ...S.td, color:'#e8a832', fontWeight:600 }}>{r.xp?.total!=null?`${r.xp.total}/${r.maxXP||170}`:'—'}</td>
                            <td style={{ ...S.td, color:r.completed?.a1?'#34d399':'#6b7a9a' }}>{r.completed?.a1?'✅':'⬜'}</td>
                            <td style={{ ...S.td, color:r.completed?.a2?'#34d399':'#6b7a9a' }}>{r.completed?.a2?'✅':'⬜'}</td>
                            <td style={{ ...S.td, color:r.completed?.a3?'#34d399':'#6b7a9a' }}>{r.completed?.a3?'✅':'⬜'}</td>
                            <td style={{ ...S.td, fontSize:'.78rem', color:'#6b7a9a' }}>{ds}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                  <p style={{ color:'#6b7a9a', fontSize:'.74rem', marginTop:'10px', fontFamily:"'Inter',sans-serif", textAlign:'right' }}>
                    {filterByPeriod(hwRows).length} student{filterByPeriod(hwRows).length!==1?'s':''}
                  </p>
                </div>
            }
          </div>
        )}

        {/* ── Writing Exponential Functions Homework ── */}
        {!loading && tab === 'writing-exp' && (
          <div style={{ width:'100%' }}>
            <div style={S.dashSectionHead}>
              <span style={S.dashSectionTitle}>x² M3T1L2 · Writing Exponential Functions</span>
              <span style={S.dashSectionSub}>{filterByPeriod(wefRows||[]).length} student{filterByPeriod(wefRows||[]).length !== 1 ? 's' : ''} completed · name filled in &amp; submitted required to appear</span>
            </div>
            {!wefRows?.length
              ? <EmptyState msg="No completed submissions yet. Students appear here once they fill in their name and submit." />
              : <div style={{ overflowX:'auto' }}>
                  <table style={S.table}>
                    <thead><tr>
                      <th style={{ ...S.th, textAlign:'left', paddingLeft:'16px' }}>Student</th>
                      <th style={{ ...S.th, color:'#a78bfa' }}>Period</th>
                      <th style={{ ...S.th, color:'#a78bfa' }}>Grade</th>
                      <th style={{ ...S.th, color:'#e8a832' }}>XP / 400</th>
                      <th style={{ ...S.th, color:'#34d399' }}>% Score</th>
                      <th style={{ ...S.th, color:'#4fc3f7' }}>Questions Done</th>
                      <th style={S.th}>Submitted</th>
                    </tr></thead>
                    <tbody>
                      {filterByPeriod(wefRows).map((r,i) => {
                        const xpEarned = r.xp ?? 0
                        const pct = Math.min(100, Math.round(xpEarned / 400 * 100))
                        const rub = rubricFor(pct)
                        const done = r.progress ? Object.values(r.progress).filter(p => p.aDone && p.bDone).length : 0
                        const ts = r.submitTimestamp||r.timestamp
                        const ds = ts ? new Date(ts).toLocaleDateString('en-US',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}) : '—'
                        const per = getPeriod(r)
                        return (
                          <tr key={r.student+i} onClick={() => setSelectedRow({...r, _tab:'writing-exp'})} style={{ ...S.tr, background: i%2===0?'rgba(255,255,255,0.015)':'transparent', cursor:'pointer' }}>
                            <td style={S.tdName}><div style={{ fontWeight:600, color:'#ede9f4', fontSize:'.9rem' }}>{r.student}</div></td>
                            <td style={{ ...S.td, color: per?'#a78bfa':'#6b7a9a', fontFamily:"'JetBrains Mono',monospace", fontWeight:per?700:400 }}>{per ? `P${per}` : '—'}</td>
                            <td style={{ ...S.td, color:rub.color, fontWeight:700, fontSize:'.9rem' }}>{rub.label}</td>
                            <td style={{ ...S.td, color:'#e8a832', fontWeight:600, fontFamily:"'JetBrains Mono',monospace" }}>{xpEarned} / 400</td>
                            <td style={{ ...S.td, color:rub.color, fontWeight:600, fontFamily:"'JetBrains Mono',monospace" }}>{pct}%</td>
                            <td style={{ ...S.td, color:'#4fc3f7', fontFamily:"'JetBrains Mono',monospace" }}>{done} / 10</td>
                            <td style={{ ...S.td, fontSize:'.78rem', color:'#6b7a9a' }}>{ds}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                  <p style={{ color:'#6b7a9a', fontSize:'.74rem', marginTop:'10px', fontFamily:"'Inter',sans-serif", textAlign:'right' }}>
                    {filterByPeriod(wefRows).length} student{filterByPeriod(wefRows).length!==1?'s':''}
                  </p>
                </div>
            }
          </div>
        )}

        {/* ── Exp Growth & Decay Skills Practice ── */}
        {!loading && tab === 'm3t2sp' && (
          <div style={{ width:'100%' }}>
            <div style={S.dashSectionHead}>
              <span style={S.dashSectionTitle}>x² M3T2 · Exponential Growth & Decay Word Problems</span>
              <span style={S.dashSectionSub}>{filterByPeriod(m3t2spRows||[]).length} student{filterByPeriod(m3t2spRows||[]).length !== 1 ? 's' : ''} completed · name filled in &amp; submitted required to appear</span>
            </div>
            {!m3t2spRows?.length
              ? <EmptyState msg="No completed submissions yet. Students appear here once they fill in their name and submit." />
              : <div style={{ overflowX:'auto' }}>
                  <table style={S.table}>
                    <thead><tr>
                      <th style={{ ...S.th, textAlign:'left', paddingLeft:'16px' }}>Student</th>
                      <th style={{ ...S.th, color:'#a78bfa' }}>Period</th>
                      <th style={{ ...S.th, color:'#34d399' }}>Grade</th>
                      <th style={{ ...S.th, color:'#e8a832' }}>XP / 200</th>
                      <th style={{ ...S.th, color:'#34d399' }}>% Score</th>
                      <th style={{ ...S.th, color:'#4fc3f7' }}>Questions Done</th>
                      <th style={S.th}>Submitted</th>
                    </tr></thead>
                    <tbody>
                      {filterByPeriod(m3t2spRows).map((r,i) => {
                        const xpEarned = r.xp ?? 0
                        const pct = Math.min(100, Math.round(xpEarned / 200 * 100))
                        const rub = rubricFor(pct)
                        const done = r.progress ? Object.keys(r.progress).filter(k => r.progress[k].eqDone).length : 0
                        const ts = r.submitTimestamp||r.timestamp
                        const ds = ts ? new Date(ts).toLocaleDateString('en-US',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}) : '—'
                        const per = getPeriod(r)
                        return (
                          <tr key={r.student+i} onClick={() => setSelectedRow({...r, _tab:'m3t2sp'})} style={{ ...S.tr, background: i%2===0?'rgba(255,255,255,0.015)':'transparent', cursor:'pointer' }}>
                            <td style={S.tdName}><div style={{ fontWeight:600, color:'#ede9f4', fontSize:'.9rem' }}>{r.student}</div></td>
                            <td style={{ ...S.td, color: per?'#a78bfa':'#6b7a9a', fontFamily:"'JetBrains Mono',monospace", fontWeight:per?700:400 }}>{per ? `P${per}` : '—'}</td>
                            <td style={{ ...S.td, color:rub.color, fontWeight:700, fontSize:'.9rem' }}>{rub.label}</td>
                            <td style={{ ...S.td, color:'#e8a832', fontWeight:600, fontFamily:"'JetBrains Mono',monospace" }}>{xpEarned} / 200</td>
                            <td style={{ ...S.td, color:rub.color, fontWeight:600, fontFamily:"'JetBrains Mono',monospace" }}>{pct}%</td>
                            <td style={{ ...S.td, color:'#4fc3f7', fontFamily:"'JetBrains Mono',monospace" }}>{done} / 5</td>
                            <td style={{ ...S.td, fontSize:'.78rem', color:'#6b7a9a' }}>{ds}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                  <p style={{ color:'#6b7a9a', fontSize:'.74rem', marginTop:'10px', fontFamily:"'Inter',sans-serif", textAlign:'right' }}>
                    {filterByPeriod(m3t2spRows).length} student{filterByPeriod(m3t2spRows).length!==1?'s':''}
                  </p>
                </div>
            }
          </div>
        )}

        {/* ── Feedback ── */}
        {!loading && tab === 'feedback' && (
          <div style={{ width:'100%' }}>
            <div style={S.dashSectionHead}>
              <span style={S.dashSectionTitle}>💬 Student Feedback & Bug Reports</span>
              <span style={S.dashSectionSub}>{fbRows?.length || 0} total · {unreadCount} new</span>
            </div>

            {/* Filter chips */}
            <div style={{ display:'flex', gap:'8px', marginBottom:'20px', flexWrap:'wrap' }}>
              {[
                { id:'all',        label:`All (${fbRows?.length||0})`,                                                      color:'#ede9f4', dim:'rgba(255,255,255,0.08)',   border:'rgba(255,255,255,0.15)' },
                { id:'bug',        label:`🐛 Bugs (${fbRows?.filter(r=>r.type==='bug').length||0})`,                         color:'#f87171', dim:'rgba(248,113,113,0.12)',   border:'rgba(248,113,113,0.3)'  },
                { id:'suggestion', label:`💡 Suggestions (${fbRows?.filter(r=>r.type==='suggestion').length||0})`,           color:'#e8a832', dim:'rgba(232,168,50,0.12)',    border:'rgba(232,168,50,0.3)'   },
                { id:'general',    label:`👍 General (${fbRows?.filter(r=>r.type==='general').length||0})`,                  color:'#34d399', dim:'rgba(52,211,153,0.12)',     border:'rgba(52,211,153,0.3)'   },
              ].map(f => (
                <button key={f.id} onClick={() => setFbFilter(f.id)} style={{
                  padding:'6px 14px', borderRadius:'20px', cursor:'pointer', fontFamily:"'Inter',sans-serif", fontSize:'.8rem', fontWeight:700, transition:'all .15s',
                  background:  fbFilter===f.id ? f.dim    : 'rgba(255,255,255,0.03)',
                  border: `1.5px solid ${fbFilter===f.id ? f.border : 'rgba(255,255,255,0.08)'}`,
                  color:       fbFilter===f.id ? f.color  : '#6b7a9a',
                }}>{f.label}</button>
              ))}
            </div>

            {/* Feedback cards */}
            {!filteredFb.length
              ? <EmptyState msg="No feedback in this category yet." />
              : <div style={{ display:'flex', flexDirection:'column', gap:'12px', width:'100%' }}>
                  {filteredFb.map(r => {
                    const ft = FB_TYPES_DASH.find(x => x.id === r.type) || FB_TYPES_DASH[2]
                    const ts = r.timestamp?.seconds ? new Date(r.timestamp.seconds*1000).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric',hour:'2-digit',minute:'2-digit'}) : '—'
                    return (
                      <div key={r.id} style={{
                        background:'rgba(14,21,40,0.70)', border:'1px solid rgba(255,255,255,0.07)',
                        borderLeft: `3px solid ${ft.color}`, borderRadius:'14px', padding:'16px 20px',
                        display:'flex', flexDirection:'column', gap:'8px',
                      }}>
                        {/* Top row */}
                        <div style={{ display:'flex', alignItems:'center', gap:'10px', flexWrap:'wrap' }}>
                          <span style={{ background:ft.dim, color:ft.color, border:`1px solid ${ft.border}`, padding:'3px 10px', borderRadius:'20px', fontSize:'.72rem', fontWeight:700, fontFamily:"'JetBrains Mono',monospace", letterSpacing:'.5px' }}>
                            {ft.label}
                          </span>
                          <span style={{ fontWeight:600, color:'#ede9f4', fontSize:'.88rem', fontFamily:"'Inter',sans-serif" }}>
                            {r.studentName || '—'}
                          </span>
                          {r.studentEmail && (
                            <span style={{ fontSize:'.74rem', color:'#6b7a9a', fontFamily:"'Inter',sans-serif" }}>
                              {r.studentEmail}
                            </span>
                          )}
                          <span style={{ marginLeft:'auto', fontSize:'.74rem', color:'#6b7a9a', fontFamily:"'JetBrains Mono',monospace", whiteSpace:'nowrap' }}>
                            {ts}
                          </span>
                        </div>
                        {/* Page context */}
                        {r.page && (
                          <span style={{ fontSize:'.74rem', color:'#6b7a9a', fontFamily:"'Inter',sans-serif" }}>
                            📍 {r.page}
                          </span>
                        )}
                        {/* Message */}
                        <p style={{ margin:0, fontSize:'.9rem', color:'#ede9f4', fontFamily:"'Inter',sans-serif", lineHeight:1.65, background:'rgba(255,255,255,0.03)', padding:'10px 14px', borderRadius:'8px' }}>
                          {r.message}
                        </p>
                      </div>
                    )
                  })}
                </div>
            }
          </div>
        )}
      </div>
    </div>
    {showRubric && <RubricModal onClose={() => setShowRubric(false)} />}
    {selectedRow && <StudentDetailModal row={selectedRow} tab={selectedRow._tab} onClose={() => setSelectedRow(null)} />}
    </>
  )
}

/* ── Root App ─────────────────────────────────────────────────────────────── */
export default function App() {
  const [user,             setUser]             = useState(undefined)
  const [screen,           setScreen]           = useState('assignments')
  const [activeModule,     setActiveModule]     = useState(null)
  const [activeAssignment, setActiveAssignment] = useState(null)
  const [activeFile,       setActiveFile]       = useState(null)
  const [activeLabel,      setActiveLabel]      = useState('Assignments')
  const [lang,             setLang]             = useState('en')
  const [period,           setPeriod]           = useState('')

  useEffect(() => {
    return onAuthStateChanged(auth, u => {
      setUser(u ?? null)
      if (!u) { setScreen('assignments'); setActiveModule(null); setActiveAssignment(null); setActiveFile(null); setPeriod('') }
    })
  }, [])

  // Load student period from Firestore on login
  useEffect(() => {
    if (!user || isTeacher(user.email)) return
    getDocs(collection(db, 'students')).then(snap => {
      const mine = snap.docs.find(d => d.data().email === user.email)
      if (mine) setPeriod(mine.data().period || '')
    }).catch(() => {})
  }, [user])

  const savePeriod = async (p) => {
    setPeriod(p)
    if (!user) return
    try {
      await setDoc(doc(db, 'students', user.uid), {
        email: user.email, displayName: user.displayName || user.email,
        period: p, updatedAt: serverTimestamp(),
      }, { merge: true })
    } catch (e) { console.error('[Period]', e) }
  }

  const handleMessage = useCallback(async e => {
    if (e.data?.type === 'scoreUpdate')
      await saveScore(user, e.data.from, e.data.score, e.data.total)
  }, [user])

  useEffect(() => {
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [handleMessage])

  function openModule(mod) {
    setActiveModule(mod)
    setScreen('moduleDetail')
  }

  function openAssignment(a) {
    if (a.methods) { setActiveAssignment(a); setActiveLabel(L(a.label, lang)); setScreen('methods') }
    else { setActiveFile(a.file); setActiveLabel(L(a.label, lang)); setScreen('activity') }
  }

  function openMethod(m) { setActiveFile(m.file); setActiveLabel(L(m.label, lang)); setScreen('activity') }

  function goBack() {
    if (screen === 'activity' && activeAssignment?.methods) { setScreen('methods') }
    else if (screen === 'activity' || screen === 'methods') { setScreen('moduleDetail'); setActiveAssignment(null); setActiveFile(null) }
    else if (screen === 'moduleDetail') { setScreen('assignments'); setActiveModule(null) }
    else { setScreen('assignments'); setActiveModule(null); setActiveAssignment(null); setActiveFile(null); setActiveLabel('Assignments') }
  }

  const t = LANGS[lang]

  // Current page label for feedback context
  const currentPage =
    screen === 'activity'      ? activeLabel :
    screen === 'methods'       ? `${activeLabel} · ${lang === 'es' ? 'Selector de Método' : 'Method Picker'}` :
    screen === 'moduleDetail'  ? `Module ${activeModule?.number} · ${L(activeModule?.title, lang)}` :
    screen === 'dashboard'     ? 'Teacher Dashboard' :
    lang === 'es' ? 'Módulos' : 'Modules'

  if (user === undefined) return <div style={{ background:'#080d1c', minHeight:'100vh' }} />
  if (!user) return <LoginScreen lang={lang} setLang={setLang} />

  return (
    <div style={S.app}>
      <div style={S.blob1} /><div style={S.blob2} /><div style={S.blob3} />

      {/* ── Nav ── */}
      <nav style={S.nav}>
        <div style={S.navLeft}>
          <div style={S.navLogoBox}>∑</div>
          <div>
            <div style={S.navTitle}>Miss Alvarado's Algebra World</div>
            <div style={S.navSub}>Algebra 1 · 2025–2026</div>
          </div>
        </div>
        <div style={S.navRight}>
          {(screen === 'activity' || screen === 'methods' || screen === 'moduleDetail') &&
            <button style={S.navBtn} onClick={goBack}>{t.back}</button>}
          {screen === 'dashboard' &&
            <button style={S.navBtn} onClick={() => setScreen('assignments')}>{t.assignments}</button>}
          {isTeacher(user.email) && screen !== 'dashboard' &&
            <button style={{ ...S.navBtn, color:'#a78bfa', borderColor:'rgba(167,139,250,0.3)' }}
              onClick={() => setScreen('dashboard')}>
              {t.dashboard}
            </button>}
          {/* Period selector — students only */}
          {!isTeacher(user.email) && (
            <>
              <div style={S.navDivider} />
              <select
                value={period}
                onChange={e => savePeriod(e.target.value)}
                style={{
                  padding: '5px 10px', borderRadius: '20px',
                  border: `1px solid ${period ? 'rgba(52,211,153,0.4)' : 'rgba(255,255,255,0.1)'}`,
                  background: period ? 'rgba(52,211,153,0.08)' : 'rgba(255,255,255,0.04)',
                  color: period ? '#34d399' : '#6b7a9a',
                  fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: '.78rem',
                  cursor: 'pointer', outline: 'none', whiteSpace: 'nowrap',
                }}
              >
                <option value="">📚 Set Period</option>
                {['1','2','3','4','5','6','7'].map(p => (
                  <option key={p} value={p}>Period {p}</option>
                ))}
              </select>
            </>
          )}
          <div style={S.navDivider} />
          {/* Language toggle */}
          <LangToggle lang={lang} setLang={setLang} />
          <div style={S.navDivider} />
          <span style={S.navUser}>{user.displayName?.split(' ')[0] || user.email}</span>
          <button style={S.navSignOut} onClick={() => signOut(auth)}>{t.signOut}</button>
        </div>
      </nav>

      {/* ── Screens ── */}
      <main style={S.main}>
        {screen === 'assignments'  && <ModulesPage      user={user} onOpen={openModule} lang={lang} setLang={setLang} />}
        {screen === 'moduleDetail' && <ModuleDetailPage mod={activeModule} onOpen={openAssignment} lang={lang} user={user} />}
        {screen === 'methods'      && <MethodsPicker    assignment={activeAssignment} onOpen={openMethod} lang={lang} />}
        {screen === 'activity'     && <ActivityFrame    file={activeFile} />}
        {screen === 'dashboard'    && isTeacher(user.email) && <TeacherDashboard />}
      </main>

      {/* Feedback button — hidden inside activity iframe */}
      {screen !== 'activity' && (
        <FeedbackButton user={user} currentPage={currentPage} lang={lang} />
      )}
    </div>
  )
}

/* ── Styles ───────────────────────────────────────────────────────────────── */
const S = {
  /* Layout */
  app:  { position:'relative', height:'100vh', background:'linear-gradient(160deg,#080d1c 0%,#090e1f 60%,#07090f 100%)', display:'flex', flexDirection:'column', overflow:'hidden' },
  blob1:{ position:'fixed', top:'-12%', left:'-6%', width:'700px', height:'700px', borderRadius:'50%', background:'radial-gradient(circle,rgba(220,38,38,.13),transparent 70%)', pointerEvents:'none', zIndex:0 },
  blob2:{ position:'fixed', bottom:'-10%', right:'-5%', width:'650px', height:'650px', borderRadius:'50%', background:'radial-gradient(circle,rgba(232,168,50,.10),transparent 70%)', pointerEvents:'none', zIndex:0 },
  blob3:{ position:'fixed', bottom:'-15%', left:'-8%', width:'500px', height:'500px', borderRadius:'50%', background:'radial-gradient(circle,rgba(139,92,246,.08),transparent 70%)', pointerEvents:'none', zIndex:0 },
  main: { flex:1, display:'flex', flexDirection:'column', overflow:'hidden', position:'relative', zIndex:1 },

  /* Nav */
  nav:       { flexShrink:0, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 28px', background:'rgba(8,13,28,.85)', backdropFilter:'blur(24px) saturate(1.4)', borderBottom:'1px solid rgba(255,255,255,.06)', zIndex:100, gap:'12px', flexWrap:'wrap' },
  navLeft:   { display:'flex', alignItems:'center', gap:'14px' },
  navLogoBox:{ width:'40px', height:'40px', borderRadius:'12px', background:'rgba(232,168,50,.12)', border:'1px solid rgba(232,168,50,.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem', color:'#e8a832', fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, flexShrink:0 },
  navTitle:  { fontFamily:"'Space Grotesk',sans-serif", fontWeight:800, fontSize:'clamp(.82rem,2vw,1.05rem)', color:'#ede9f4', lineHeight:1.2 },
  navSub:    { fontFamily:"'JetBrains Mono',monospace", fontSize:'.62rem', color:'#6b7a9a', letterSpacing:'1px', textTransform:'uppercase', marginTop:'2px' },
  navRight:  { display:'flex', alignItems:'center', gap:'8px', flexWrap:'wrap' },
  navBtn:    { padding:'6px 14px', borderRadius:'20px', border:'1px solid rgba(255,255,255,.1)', background:'rgba(255,255,255,.04)', color:'#6b7a9a', fontFamily:"'Inter',sans-serif", fontWeight:700, fontSize:'.8rem', cursor:'pointer', transition:'all .2s', whiteSpace:'nowrap' },
  navDivider:{ width:'1px', height:'20px', background:'rgba(255,255,255,.08)', margin:'0 4px', flexShrink:0 },
  navUser:   { fontSize:'.82rem', color:'#ede9f4', fontFamily:"'Inter',sans-serif", fontWeight:600, whiteSpace:'nowrap' },
  navSignOut:{ padding:'5px 12px', borderRadius:'20px', border:'1px solid rgba(255,255,255,.08)', background:'transparent', color:'#6b7a9a', fontFamily:"'Inter',sans-serif", fontSize:'.76rem', fontWeight:600, cursor:'pointer', whiteSpace:'nowrap' },

  /* Language toggle */
  langToggle:   { display:'flex', background:'rgba(255,255,255,0.04)', borderRadius:'11px', border:'1px solid rgba(255,255,255,0.07)', padding:'2px', gap:'2px', flexShrink:0 },
  langBtn:      { padding:'4px 11px', borderRadius:'9px', border:'none', cursor:'pointer', fontFamily:"'JetBrains Mono',monospace", fontSize:'.7rem', fontWeight:700, letterSpacing:'1px', color:'#6b7a9a', background:'transparent', transition:'all .18s' },
  langBtnActive:{ background:'#e8a832', color:'#080d1c' },

  /* Pages */
  scrollPage:{ flex:1, overflowY:'auto', padding:'0 20px 80px' },
  pageInner: { maxWidth:'1060px', margin:'0 auto', paddingTop:'44px', display:'flex', flexDirection:'column' },

  /* Greeting */
  greeting:    { marginBottom:'40px', textAlign:'center' },
  greetEyebrow:{ fontFamily:"'JetBrains Mono',monospace", fontSize:'.72rem', fontWeight:500, letterSpacing:'2.5px', textTransform:'uppercase', color:'#e8a832', marginBottom:'10px' },
  greetName:   { fontFamily:"'Space Grotesk','Inter',sans-serif", fontSize:'clamp(1.8rem,4vw,2.6rem)', fontWeight:800, lineHeight:1.1, marginBottom:'12px', background:'linear-gradient(135deg,#ede9f4 0%,#f43f5e 28%,#a78bfa 62%,#e8a832 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', textAlign:'center' },
  greetSub:    { fontSize:'.95rem', color:'#6b7a9a', lineHeight:1.7, fontFamily:"'Inter',sans-serif", maxWidth:'500px', margin:'0 auto', textAlign:'center' },

  /* Unit grid — horizontal 3 columns */
  unitGrid:{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'24px' },
  unitCol: { display:'flex', flexDirection:'column', gap:'14px' },
  unitHead:{ display:'flex', flexDirection:'column', gap:'6px', marginBottom:'4px' },
  unitPill:{ fontFamily:"'JetBrains Mono',monospace", fontSize:'.68rem', fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', padding:'4px 12px', borderRadius:'20px', width:'fit-content' },
  unitTitle:{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'1rem', fontWeight:700, color:'#ede9f4' },

  /* Assignment cards */
  aCard:    { background:'rgba(14,21,40,.70)', border:'1px solid rgba(255,255,255,.07)', borderTop:'3px solid', borderRadius:'20px', padding:'20px 18px', display:'flex', flexDirection:'column', gap:'14px', cursor:'pointer', textAlign:'left', fontFamily:"'Inter',sans-serif", transition:'transform .25s ease,box-shadow .25s ease,border-color .25s ease,background .25s', backdropFilter:'blur(12px)', width:'100%' },
  aCardDark:{ background:'rgba(8,13,28,.88)', boxShadow:'0 6px 28px rgba(0,0,0,.4)' },
  aIcon:    { width:'46px', height:'46px', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.35rem', flexShrink:0 },
  aTag:     { fontFamily:"'JetBrains Mono',monospace", fontSize:'.61rem', fontWeight:600, letterSpacing:'1.2px', textTransform:'uppercase', padding:'3px 10px', borderRadius:'20px', width:'fit-content', marginBottom:'6px' },
  aLabel:   { fontFamily:"'Space Grotesk',sans-serif", fontSize:'1.05rem', fontWeight:700, color:'#ede9f4', lineHeight:1.2, marginBottom:'5px' },
  aDesc:    { fontSize:'.82rem', lineHeight:1.65, flex:1 },
  aFooter:  { display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:'12px', borderTop:'1px solid', marginTop:'4px' },
  aArrow:   { width:'26px', height:'26px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.85rem', transition:'transform .2s', flexShrink:0 },

  /* Methods */
  mpHead:{ marginBottom:'36px', textAlign:'center' },
  mGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:'20px' },
  mCard: { background:'rgba(14,21,40,.65)', border:'1px solid rgba(255,255,255,.07)', borderRadius:'20px', padding:'26px 22px', display:'flex', flexDirection:'column', gap:'12px', cursor:'pointer', textAlign:'left', fontFamily:"'Inter',sans-serif", transition:'all .25s', backdropFilter:'blur(12px)', width:'100%' },
  mIcon: { width:'52px', height:'52px', borderRadius:'14px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.6rem' },
  mTag:  { fontFamily:"'JetBrains Mono',monospace", fontSize:'.65rem', fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase' },
  mLabel:{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'1.2rem', fontWeight:700, color:'#ede9f4' },
  mDesc: { fontSize:'.84rem', color:'#6b7a9a', lineHeight:1.6, flex:1 },
  mGo:   { padding:'7px 16px', borderRadius:'20px', fontSize:'.82rem', fontWeight:700, width:'fit-content', transition:'transform .2s' },

  /* iframe */
  frame: { width:'100%', height:'100%', border:'none', display:'block', flex:1 },

  /* Dashboard */
  dashSectionHead: { marginBottom:'18px' },
  dashSectionTitle:{ display:'block', fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:'1rem', color:'#ede9f4', marginBottom:'4px' },
  dashSectionSub:  { display:'block', fontFamily:"'Inter',sans-serif", fontSize:'.8rem', color:'#6b7a9a' },
  tabBtn:{ padding:'8px 18px', borderRadius:'20px', border:'1px solid rgba(255,255,255,.08)', fontFamily:"'Inter',sans-serif", fontSize:'.84rem', fontWeight:700, cursor:'pointer', transition:'all .2s', whiteSpace:'nowrap', position:'relative' },
  table: { width:'100%', borderCollapse:'collapse', background:'rgba(14,21,40,.70)', border:'1px solid rgba(255,255,255,.06)', borderRadius:'16px', overflow:'hidden', fontFamily:"'Inter',sans-serif" },
  th:    { padding:'14px 16px', textAlign:'center', fontSize:'.74rem', fontWeight:700, letterSpacing:'.5px', textTransform:'uppercase', color:'#6b7a9a', borderBottom:'1px solid rgba(255,255,255,.08)', background:'rgba(255,255,255,.02)', fontFamily:"'JetBrains Mono',monospace" },
  tr:    { borderBottom:'1px solid rgba(255,255,255,.04)', transition:'background .15s' },
  tdName:{ padding:'14px 16px', verticalAlign:'middle' },
  td:    { padding:'14px 16px', textAlign:'center', fontSize:'.9rem', verticalAlign:'middle' },

  /* Feedback button + modal */
  fbFloatBtn:{ position:'fixed', bottom:'24px', right:'24px', zIndex:200, height:'44px', padding:'0 16px 0 12px', borderRadius:'22px', background:'rgba(167,139,250,0.15)', border:'1.5px solid rgba(167,139,250,0.35)', color:'#a78bfa', cursor:'pointer', display:'flex', alignItems:'center', gap:'7px', boxShadow:'0 4px 20px rgba(0,0,0,.3)', transition:'all .2s', backdropFilter:'blur(12px)' },
  fbOverlay:  { position:'fixed', inset:0, background:'rgba(0,0,0,.6)', backdropFilter:'blur(8px)', zIndex:500, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' },
  fbModal:    { background:'rgba(14,21,40,.96)', border:'1px solid rgba(255,255,255,.1)', borderRadius:'24px', padding:'32px 28px', maxWidth:'480px', width:'100%', boxShadow:'0 28px 64px rgba(0,0,0,.5)', backdropFilter:'blur(24px)' },
  fbModalHead:{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'16px', marginBottom:'22px' },
  fbTitle:    { fontFamily:"'Space Grotesk',sans-serif", fontWeight:800, fontSize:'1.2rem', color:'#ede9f4', marginBottom:'4px' },
  fbSubtitle: { fontFamily:"'Inter',sans-serif", fontSize:'.84rem', color:'#6b7a9a' },
  fbClose:    { background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.1)', color:'#6b7a9a', borderRadius:'8px', width:'30px', height:'30px', cursor:'pointer', fontSize:'.8rem', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' },
  fbLabel:    { fontFamily:"'Inter',sans-serif", fontSize:'.8rem', fontWeight:700, color:'#6b7a9a', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:'10px' },
  fbTextarea: { width:'100%', background:'rgba(255,255,255,.04)', border:'1.5px solid rgba(255,255,255,.1)', borderRadius:'12px', color:'#ede9f4', fontFamily:"'Inter',sans-serif", fontSize:'.9rem', padding:'12px 14px', resize:'vertical', outline:'none', lineHeight:1.6, boxSizing:'border-box' },
  fbCancel:   { padding:'9px 20px', borderRadius:'10px', border:'1px solid rgba(255,255,255,.1)', background:'rgba(255,255,255,.04)', color:'#6b7a9a', fontFamily:"'Inter',sans-serif", fontWeight:700, fontSize:'.88rem', cursor:'pointer' },
  fbSubmit:   { padding:'9px 22px', borderRadius:'10px', border:'1.5px solid', fontFamily:"'Inter',sans-serif", fontWeight:800, fontSize:'.88rem', cursor:'pointer', transition:'all .2s' },

  /* Footer */
  pageFooter:{ display:'flex', alignItems:'center', gap:'8px', fontSize:'.78rem', color:'#6b7a9a', fontFamily:"'Inter',sans-serif", marginTop:'20px', justifyContent:'center' },
  footerDot: { width:'7px', height:'7px', borderRadius:'50%', background:'#34d399', boxShadow:'0 0 8px #34d399', display:'inline-block', flexShrink:0 },

  /* Login */
  loginBg:     { minHeight:'100vh', width:'100vw', background:'linear-gradient(160deg,#080d1c 0%,#090e1f 60%,#07090f 100%)', display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 20px', position:'relative', overflow:'hidden' },
  loginCard:   { background:'rgba(10,16,30,.92)', border:'1px solid rgba(220,38,38,.18)', borderTop:'2px solid rgba(220,38,38,.55)', borderRadius:'28px', padding:'52px 44px', maxWidth:'420px', width:'100%', display:'flex', flexDirection:'column', alignItems:'center', backdropFilter:'blur(24px)', boxShadow:'0 32px 80px rgba(0,0,0,.55), 0 0 0 1px rgba(220,38,38,.08)', position:'relative', zIndex:1, textAlign:'center', gap:0 },
  loginLogoBox:{ width:'68px', height:'68px', borderRadius:'20px', background:'rgba(232,168,50,.12)', border:'1px solid rgba(232,168,50,.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2rem', color:'#e8a832', fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, marginBottom:'24px' },
  loginEyebrow:{ fontFamily:"'JetBrains Mono',monospace", fontSize:'.72rem', fontWeight:500, letterSpacing:'2.5px', textTransform:'uppercase', color:'#e8a832', marginBottom:'10px' },
  loginTitle:  { fontFamily:"'Space Grotesk',sans-serif", fontSize:'1.75rem', fontWeight:800, background:'linear-gradient(135deg,#f43f5e 0%,#a78bfa 52%,#e8a832 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', lineHeight:1.2, marginBottom:'14px' },
  loginSub:    { fontSize:'.88rem', color:'#6b7a9a', lineHeight:1.65, marginBottom:'32px', fontFamily:"'Inter',sans-serif" },
  loginErr:    { color:'#f87171', fontSize:'.82rem', background:'rgba(248,113,113,.08)', border:'1px solid rgba(248,113,113,.2)', borderRadius:'8px', padding:'10px 14px', marginBottom:'16px', width:'100%', fontFamily:"'Inter',sans-serif" },
  googleBtn:   { display:'flex', alignItems:'center', gap:'12px', padding:'13px 28px', background:'#fff', border:'1.5px solid #dadce0', borderRadius:'10px', fontSize:'.95rem', fontWeight:600, color:'#3c4043', cursor:'pointer', transition:'box-shadow .15s', fontFamily:"'Inter',sans-serif", whiteSpace:'nowrap' },
}
