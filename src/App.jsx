import { useState, useEffect, useCallback } from 'react'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore'
import { initializeApp } from 'firebase/app'
import './App.css'

// ── Firebase ────────────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey:            "AIzaSyAbnknXhx9VYY9L8UFW6uMpNYLM6SRsMVg",
  authDomain:        "solving-systems-activities.firebaseapp.com",
  projectId:         "solving-systems-activities",
  storageBucket:     "solving-systems-activities.firebasestorage.app",
  messagingSenderId: "81374640982",
  appId:             "1:81374640982:web:ad4796df648ddf464774f7",
}
const firebaseApp = initializeApp(firebaseConfig)
const auth        = getAuth(firebaseApp)
const db          = getFirestore(firebaseApp)
const provider    = new GoogleAuthProvider()

// ── Role detection ───────────────────────────────────────────────────────────
const TEACHER_EMAIL = 'elizalvarado@paps.net'

function isTeacher(email) {
  return email === TEACHER_EMAIL
}

// ── Score helper ─────────────────────────────────────────────────────────────
async function saveScore(user, activity, score, total) {
  if (!user) return
  try {
    const id = `${activity}_${user.email}`
    await setDoc(doc(db, 'scores', id), {
      email:       user.email,
      displayName: user.displayName || user.email,
      activity,
      score,
      total,
      updatedAt: serverTimestamp(),
    }, { merge: true })
    console.log(`[Score] Saved ${activity}: ${score}/${total}`)
  } catch (e) {
    console.error('[Score] Failed to save:', e)
  }
}

// ── Activities ───────────────────────────────────────────────────────────────
const activities = [
  {
    id: 'graphing',
    label: 'Graphing',
    icon: '📈',
    tag: 'Method 1',
    file: '/systems-graphing-socratic.html',
    color: '#4fc3f7',
    colorDim: 'rgba(79,195,247,0.12)',
    colorBorder: 'rgba(79,195,247,0.25)',
    desc: 'Graph both equations and find where the lines intersect.',
  },
  {
    id: 'substitution',
    label: 'Substitution',
    icon: '🔁',
    tag: 'Method 2',
    file: '/systems-substitution-socratic.html',
    color: '#34d399',
    colorDim: 'rgba(52,211,153,0.12)',
    colorBorder: 'rgba(52,211,153,0.25)',
    desc: 'Solve for one variable and substitute it into the other equation.',
  },
  {
    id: 'elimination',
    label: 'Elimination',
    icon: '➕',
    tag: 'Method 3',
    file: '/systems-elimination-socratic.html',
    color: '#e8a832',
    colorDim: 'rgba(232,168,50,0.12)',
    colorBorder: 'rgba(232,168,50,0.25)',
    desc: 'Add or subtract equations to cancel a variable and solve.',
  },
]

// ── Google Sign-In Screen ────────────────────────────────────────────────────
function LoginScreen() {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  async function handleSignIn() {
    setLoading(true)
    setError(null)
    try {
      await signInWithPopup(auth, provider)
    } catch (err) {
      console.error('[Auth] Sign-in error:', err)
      if (err.code === 'auth/popup-blocked') {
        setError('Popup was blocked. Please allow popups for this site and try again.')
      } else if (err.code === 'auth/cancelled-popup-request' || err.code === 'auth/popup-closed-by-user') {
        // user dismissed — no message needed
      } else {
        setError('Sign-in failed. Please try again.')
      }
      setLoading(false)
    }
  }

  return (
    <div style={styles.loginBg}>
      <div style={styles.blob1} />
      <div style={styles.blob2} />

      <div style={styles.loginCard}>
        <div style={styles.loginIconWrap}>
          <span style={styles.loginIcon}>∑</span>
        </div>

        <p style={styles.loginEyebrow}>Test Review</p>
        <h1 style={styles.loginTitle}>Systems of Equations</h1>
        <p style={styles.loginSubtitle}>
          Sign in with your school Google account to begin.
        </p>

        {error && <p style={styles.loginError}>{error}</p>}

        <button
          onClick={handleSignIn}
          disabled={loading}
          style={{ ...styles.googleBtn, opacity: loading ? 0.6 : 1 }}
        >
          <svg width="20" height="20" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          {loading ? 'Signing in…' : 'Sign in with Google'}
        </button>
      </div>
    </div>
  )
}

// ── Teacher Dashboard ─────────────────────────────────────────────────────────
function TeacherDashboard({ user, onBack }) {
  const [rows,        setRows]        = useState(null)
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState(null)
  const [refreshKey,  setRefreshKey]  = useState(0)

  useEffect(() => {
    setLoading(true)
    setError(null)
    getDocs(collection(db, 'scores'))
      .then(snap => {
        const byStudent = {}
        snap.docs.forEach(d => {
          const { email, displayName, activity, score, total } = d.data()
          if (!byStudent[email]) {
            byStudent[email] = { email, displayName, graphing: null, substitution: null, elimination: null }
          }
          byStudent[email][activity] = { score, total }
        })
        setRows(Object.values(byStudent).sort((a, b) => a.email.localeCompare(b.email)))
      })
      .catch(e => {
        console.error('[Dashboard] Failed to load scores:', e)
        setError('Could not load scores. Check your Firestore rules.')
      })
      .finally(() => setLoading(false))
  }, [refreshKey])

  function fmt(s) {
    if (!s) return '—'
    return `${s.score} / ${s.total}`
  }

  function cellColor(s) {
    if (!s) return '#6b7a9a'
    const pct = s.score / s.total
    if (pct >= 0.75) return '#34d399'
    if (pct >= 0.5)  return '#e8a832'
    return '#f87171'
  }

  function totalColor(t) {
    if (t >= 8) return '#34d399'
    if (t >= 5) return '#e8a832'
    return '#f87171'
  }

  return (
    <div style={styles.landing}>
      <div style={styles.blob1} />
      <div style={styles.blob2} />

      {/* Top bar */}
      <div style={styles.userBar}>
        <span style={styles.userEmail}>{user.displayName || user.email}</span>
        <button style={styles.signOutBtn} onClick={() => signOut(auth)}>Sign out</button>
      </div>

      <div style={{ ...styles.landingInner, maxWidth: '960px', alignItems: 'flex-start' }}>
        <div style={styles.eyebrow}>Teacher View</div>
        <h1 style={{ ...styles.h1, fontSize: 'clamp(1.6rem,4vw,2.4rem)', marginBottom: '8px', textAlign: 'left' }}>
          Student Scores
        </h1>
        <p style={{ ...styles.subtitle, textAlign: 'left', marginBottom: '28px' }}>
          Live scores from all three activities. Green = 75%+, Yellow = 50%+, Red = below 50%.
        </p>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '28px', flexWrap: 'wrap' }}>
          <button style={styles.dashActionBtn} onClick={onBack}>
            ← Back to Activities
          </button>
          <button
            style={{ ...styles.dashActionBtn, color: '#34d399', borderColor: 'rgba(52,211,153,0.25)' }}
            onClick={() => setRefreshKey(k => k + 1)}
          >
            ↻ Refresh
          </button>
        </div>

        {/* States */}
        {loading && (
          <p style={{ color: '#6b7a9a', fontFamily: "'Outfit', sans-serif" }}>Loading scores…</p>
        )}
        {error && (
          <p style={{ color: '#f87171', fontFamily: "'Outfit', sans-serif",
            background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)',
            padding: '12px 16px', borderRadius: '10px' }}>
            {error}
          </p>
        )}
        {!loading && !error && rows?.length === 0 && (
          <div style={{ textAlign: 'center', width: '100%', paddingTop: '60px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📭</div>
            <p style={{ color: '#6b7a9a', fontFamily: "'Outfit', sans-serif", fontSize: '1rem' }}>
              No scores yet. Students will appear here as they answer problems.
            </p>
          </div>
        )}

        {/* Scores table */}
        {!loading && rows && rows.length > 0 && (
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={{ ...styles.th, textAlign: 'left', paddingLeft: '16px' }}>Student</th>
                  <th style={{ ...styles.th, color: '#4fc3f7' }}>📈 Graphing</th>
                  <th style={{ ...styles.th, color: '#34d399' }}>🔁 Substitution</th>
                  <th style={{ ...styles.th, color: '#e8a832' }}>➕ Elimination</th>
                  <th style={styles.th}>Total</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => {
                  const total = (r.graphing?.score || 0) + (r.substitution?.score || 0) + (r.elimination?.score || 0)
                  return (
                    <tr key={r.email} style={{ ...styles.tr, background: i % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'transparent' }}>
                      <td style={styles.tdName}>
                        <div style={{ fontWeight: 600, color: '#ede9f4', fontSize: '.9rem' }}>
                          {r.displayName}
                        </div>
                        <div style={{ fontSize: '.72rem', color: '#6b7a9a', marginTop: '2px' }}>
                          {r.email}
                        </div>
                      </td>
                      <td style={{ ...styles.td, color: cellColor(r.graphing),     fontWeight: r.graphing     ? 600 : 400 }}>{fmt(r.graphing)}</td>
                      <td style={{ ...styles.td, color: cellColor(r.substitution), fontWeight: r.substitution ? 600 : 400 }}>{fmt(r.substitution)}</td>
                      <td style={{ ...styles.td, color: cellColor(r.elimination),  fontWeight: r.elimination  ? 600 : 400 }}>{fmt(r.elimination)}</td>
                      <td style={{ ...styles.td, color: totalColor(total), fontWeight: 700, fontSize: '1rem' }}>
                        {total} / 12
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <p style={{ color: '#6b7a9a', fontSize: '.74rem', marginTop: '12px',
              fontFamily: "'Outfit', sans-serif", textAlign: 'right' }}>
              {rows.length} student{rows.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Activity View (iframe) ───────────────────────────────────────────────────
function ActivityView({ active, setActive, activities, user }) {
  const current = activities.find(a => a.id === active)

  const handleMessage = useCallback(async (e) => {
    if (e.data?.type === 'nextActivity') {
      const order = ['graphing', 'substitution', 'elimination']
      const idx = order.indexOf(e.data.from)
      if (idx !== -1 && idx < order.length - 1) {
        setActive(order[idx + 1])
      } else {
        setActive(null)
      }
    }
    if (e.data?.type === 'scoreUpdate') {
      const { from, score, total } = e.data
      await saveScore(user, from, score, total)
    }
  }, [setActive, user])

  useEffect(() => {
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [handleMessage])

  if (!current) return null

  return (
    <div style={styles.wrapper}>
      <nav style={styles.activityNav}>
        <button style={styles.backBtn} onClick={() => setActive(null)}>
          ← Back
        </button>
        <span style={{ ...styles.activityTitle, color: current.color }}>
          {current.icon} {current.label}
        </span>
        <div style={styles.navTabs}>
          {activities.map(a => (
            <button
              key={a.id}
              onClick={() => setActive(a.id)}
              style={{
                ...styles.navTab,
                borderColor: active === a.id ? a.color : 'transparent',
                color: active === a.id ? a.color : '#6b7a9a',
                background: active === a.id ? a.colorDim : 'transparent',
              }}
            >
              {a.icon} {a.label}
            </button>
          ))}
        </div>
      </nav>
      <iframe
        key={current.id}
        src={current.file}
        title={current.label}
        style={styles.frame}
      />
    </div>
  )
}

// ── Landing Page ─────────────────────────────────────────────────────────────
function LandingPage({ user, setActive, onDashboard }) {
  const [hovered, setHovered] = useState(null)

  return (
    <div style={styles.landing}>
      <div style={styles.blob1} />
      <div style={styles.blob2} />

      {/* Top-right user info + controls */}
      <div style={styles.userBar}>
        {isTeacher(user.email) && (
          <button style={styles.dashBtn} onClick={onDashboard} title="Teacher Dashboard">
            📊 Dashboard
          </button>
        )}
        <span style={styles.userEmail}>{user.displayName || user.email}</span>
        <button style={styles.signOutBtn} onClick={() => signOut(auth)}>
          Sign out
        </button>
      </div>

      <div style={styles.landingInner}>
        <div style={styles.eyebrow}>Test Review</div>
        <h1 style={styles.h1}>Systems of Equations</h1>
        <p style={styles.subtitle}>
          Choose a method to practice. Complete at least 2 out of 4 problems
          in each activity to finish that challenge.
        </p>
        <div style={styles.cards}>
          {activities.map(a => (
            <ActivityCard
              key={a.id}
              activity={a}
              onSelect={setActive}
              hovered={hovered === a.id}
              setHovered={setHovered}
            />
          ))}
        </div>
        <div style={styles.footerNote}>
          <span style={styles.dot} />
          Built-in calculator &amp; bilingual support (EN / ES)
        </div>
      </div>
    </div>
  )
}

// ── Activity Card ─────────────────────────────────────────────────────────────
function ActivityCard({ activity: a, onSelect, hovered, setHovered }) {
  return (
    <button
      onClick={() => onSelect(a.id)}
      onMouseEnter={() => setHovered(a.id)}
      onMouseLeave={() => setHovered(null)}
      style={{
        ...styles.card,
        borderTop: `3px solid ${a.color}`,
        borderColor: hovered ? a.colorBorder : 'rgba(255,255,255,0.06)',
        borderTopColor: a.color,
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hovered
          ? `0 20px 48px rgba(0,0,0,0.45), 0 0 0 1px ${a.colorBorder}`
          : '0 4px 24px rgba(0,0,0,0.3)',
      }}
    >
      <div style={{ ...styles.cardIcon, background: a.colorDim, border: `1px solid ${a.colorBorder}` }}>
        {a.icon}
      </div>
      <div style={{ ...styles.cardTag, color: a.color, background: a.colorDim, border: `1px solid ${a.colorBorder}` }}>
        {a.tag}
      </div>
      <div style={styles.cardTitle}>{a.label}</div>
      <div style={styles.cardDesc}>{a.desc}</div>
      <div style={styles.cardFooter}>
        <span style={styles.cardFooterLabel}>4 problems · Socratic guide</span>
        <div style={{
          ...styles.cardArrow,
          background: a.colorDim,
          color: a.color,
          transform: hovered ? 'translateX(4px)' : 'translateX(0)',
        }}>→</div>
      </div>
    </button>
  )
}

// ── Root App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [user,   setUser]   = useState(undefined)   // undefined = still resolving
  const [active, setActive] = useState(null)
  const [view,   setView]   = useState('landing')   // 'landing' | 'dashboard'

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u ?? null)
      if (!u) {
        setActive(null)
        setView('landing')
      }
    })
    return () => unsubscribe()
  }, [])

  // Still checking persisted session
  if (user === undefined) {
    return <div style={{ background: '#080d1c', minHeight: '100vh' }} />
  }

  // Not signed in
  if (!user) {
    return <LoginScreen />
  }

  // Teacher dashboard — only reachable if the signed-in user is a teacher
  if (view === 'dashboard' && isTeacher(user.email)) {
    return <TeacherDashboard user={user} onBack={() => setView('landing')} />
  }

  // Activity is open
  if (active !== null) {
    return <ActivityView active={active} setActive={setActive} activities={activities} user={user} />
  }

  // Landing page
  return (
    <LandingPage
      user={user}
      setActive={setActive}
      onDashboard={() => setView('dashboard')}
    />
  )
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = {
  // Login
  loginBg: {
    minHeight: '100vh', width: '100vw',
    background: '#080d1c',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '40px 20px', position: 'relative', overflow: 'hidden',
  },
  loginCard: {
    background: 'rgba(14,21,40,0.85)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '24px',
    padding: '52px 44px',
    maxWidth: '420px', width: '100%',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    gap: '0',
    backdropFilter: 'blur(24px)',
    boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
    position: 'relative', zIndex: 1,
    textAlign: 'center',
  },
  loginIconWrap: {
    width: '64px', height: '64px', borderRadius: '18px',
    background: 'rgba(232,168,50,0.12)',
    border: '1px solid rgba(232,168,50,0.3)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: '24px',
  },
  loginIcon: {
    fontSize: '1.9rem', color: '#e8a832',
    fontFamily: "'Syne', sans-serif", fontWeight: 700,
  },
  loginEyebrow: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '.72rem', fontWeight: 500,
    letterSpacing: '2.5px', textTransform: 'uppercase',
    color: '#e8a832', marginBottom: '10px',
  },
  loginTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: '1.6rem', fontWeight: 800,
    background: 'linear-gradient(135deg,#ede9f4 0%,#a78bfa 55%,#e8a832 100%)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    lineHeight: 1.2, marginBottom: '12px',
  },
  loginSubtitle: {
    fontSize: '.88rem', color: '#6b7a9a',
    lineHeight: 1.65, marginBottom: '32px',
    fontFamily: "'Outfit', sans-serif",
  },
  loginError: {
    color: '#f87171', fontSize: '.82rem',
    background: 'rgba(248,113,113,0.08)',
    border: '1px solid rgba(248,113,113,0.2)',
    borderRadius: '8px', padding: '10px 14px',
    marginBottom: '16px', width: '100%',
    fontFamily: "'Outfit', sans-serif",
  },
  googleBtn: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '13px 28px',
    background: '#fff',
    border: '1.5px solid #dadce0',
    borderRadius: '10px',
    fontSize: '.95rem', fontWeight: 600,
    color: '#3c4043',
    cursor: 'pointer',
    transition: 'box-shadow .15s, background .15s',
    fontFamily: "'Outfit', sans-serif",
    whiteSpace: 'nowrap',
  },

  // User bar on landing page
  userBar: {
    position: 'fixed', top: '16px', right: '20px',
    display: 'flex', alignItems: 'center', gap: '10px',
    zIndex: 50,
  },
  dashBtn: {
    padding: '5px 12px', borderRadius: '20px',
    border: '1px solid rgba(167,139,250,0.3)',
    background: 'rgba(167,139,250,0.08)',
    color: '#a78bfa',
    fontFamily: "'Outfit', sans-serif",
    fontSize: '.76rem', fontWeight: 600, cursor: 'pointer',
    transition: 'all .2s',
  },
  userEmail: {
    fontSize: '.78rem', color: '#6b7a9a',
    fontFamily: "'Outfit', sans-serif",
  },
  signOutBtn: {
    padding: '5px 12px', borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.04)',
    color: '#6b7a9a', fontFamily: "'Outfit', sans-serif",
    fontSize: '.76rem', fontWeight: 600, cursor: 'pointer',
  },

  // Activity view
  wrapper: {
    display: 'flex', flexDirection: 'column',
    height: '100vh', width: '100vw',
    background: '#080d1c',
    position: 'absolute', top: 0, left: 0, zIndex: 100,
  },
  activityNav: {
    display: 'flex', alignItems: 'center',
    padding: '10px 20px', gap: '12px',
    background: '#0e1528',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    flexShrink: 0, flexWrap: 'wrap',
  },
  backBtn: {
    padding: '6px 14px', borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.04)',
    color: '#6b7a9a', fontFamily: "'Outfit', sans-serif",
    fontWeight: 700, fontSize: '.82rem', cursor: 'pointer',
  },
  activityTitle: {
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 700, fontSize: '1rem', flex: 1,
  },
  navTabs: { display: 'flex', gap: '6px', flexWrap: 'wrap' },
  navTab: {
    padding: '6px 14px', borderRadius: '20px',
    border: '1px solid transparent',
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 700, fontSize: '.8rem', cursor: 'pointer',
    transition: 'all .2s',
  },
  frame: { flex: 1, width: '100%', border: 'none' },

  // Teacher dashboard
  dashActionBtn: {
    padding: '7px 16px', borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.04)',
    color: '#6b7a9a', fontFamily: "'Outfit', sans-serif",
    fontSize: '.82rem', fontWeight: 600, cursor: 'pointer',
    transition: 'all .2s',
  },
  table: {
    width: '100%', borderCollapse: 'collapse',
    background: 'rgba(14,21,40,0.7)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '16px', overflow: 'hidden',
    fontFamily: "'Outfit', sans-serif",
  },
  th: {
    padding: '14px 16px',
    textAlign: 'center',
    fontSize: '.78rem', fontWeight: 700,
    letterSpacing: '0.5px', textTransform: 'uppercase',
    color: '#6b7a9a',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.02)',
    fontFamily: "'JetBrains Mono', monospace",
  },
  tr: {
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    transition: 'background .15s',
  },
  tdName: {
    padding: '14px 16px',
    verticalAlign: 'middle',
  },
  td: {
    padding: '14px 16px',
    textAlign: 'center',
    fontSize: '.9rem',
    verticalAlign: 'middle',
  },

  // Landing page
  landing: {
    minHeight: '100vh', width: '100vw',
    background: '#080d1c',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '40px 20px', position: 'relative', overflow: 'hidden',
  },
  blob1: {
    position: 'absolute', top: '-10%', left: '-5%',
    width: '500px', height: '500px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(139,92,246,0.12), transparent 70%)',
    pointerEvents: 'none',
  },
  blob2: {
    position: 'absolute', bottom: '-10%', right: '-5%',
    width: '500px', height: '500px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(232,168,50,0.09), transparent 70%)',
    pointerEvents: 'none',
  },
  landingInner: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', width: '100%', maxWidth: '960px',
    position: 'relative', zIndex: 1,
  },
  eyebrow: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '.75rem', fontWeight: 500,
    letterSpacing: '2.5px', textTransform: 'uppercase',
    color: '#e8a832', marginBottom: '14px',
  },
  h1: {
    fontFamily: "'Syne', 'Outfit', sans-serif",
    fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 800,
    lineHeight: 1.1, marginBottom: '16px', textAlign: 'center',
    background: 'linear-gradient(135deg,#ede9f4 0%,#a78bfa 55%,#e8a832 100%)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: '1rem', color: '#6b7a9a',
    maxWidth: '460px', textAlign: 'center',
    lineHeight: 1.7, marginBottom: '48px',
    fontFamily: "'Outfit', sans-serif",
  },
  cards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
    gap: '22px', width: '100%', marginBottom: '40px',
  },
  card: {
    background: 'rgba(14,21,40,0.7)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '20px', padding: '28px 24px',
    display: 'flex', flexDirection: 'column', gap: '14px',
    cursor: 'pointer', textAlign: 'left',
    fontFamily: "'Outfit', sans-serif",
    transition: 'transform .25s ease, box-shadow .25s ease, border-color .25s ease',
    backdropFilter: 'blur(12px)',
  },
  cardIcon: {
    width: '50px', height: '50px', borderRadius: '13px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1.5rem',
  },
  cardTag: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '.65rem', fontWeight: 600,
    letterSpacing: '1.5px', textTransform: 'uppercase',
    padding: '3px 10px', borderRadius: '20px', width: 'fit-content',
  },
  cardTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: '1.2rem', fontWeight: 700,
    color: '#ede9f4', lineHeight: 1.2,
  },
  cardDesc: {
    fontSize: '.87rem', color: '#6b7a9a',
    lineHeight: 1.65, flex: 1,
  },
  cardFooter: {
    display: 'flex', alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '14px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    marginTop: '4px',
  },
  cardFooterLabel: { fontSize: '.76rem', color: '#6b7a9a', fontWeight: 500 },
  cardArrow: {
    width: '30px', height: '30px', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1rem', transition: 'transform .2s',
  },
  footerNote: {
    display: 'flex', alignItems: 'center', gap: '8px',
    fontSize: '.78rem', color: '#6b7a9a',
    fontFamily: "'Outfit', sans-serif",
  },
  dot: {
    width: '7px', height: '7px', borderRadius: '50%',
    background: '#34d399', boxShadow: '0 0 8px #34d399',
    display: 'inline-block',
  },
}
