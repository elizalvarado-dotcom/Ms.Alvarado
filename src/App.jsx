import { useState } from 'react'
import './App.css'

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

// Separate component for the Activity View
function ActivityView({ active, setActive, activities }) {
  const current = activities.find(a => a.id === active)
  
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

// Separate component for the Landing Page
function LandingPage({ setActive, activities }) {
  return (
    <div style={styles.landing}>
      <div style={styles.blob1} />
      <div style={styles.blob2} />
      <div style={styles.landingInner}>
        <div style={styles.eyebrow}>Test Review</div>
        <h1 style={styles.h1}>Systems of Equations</h1>
        <p style={styles.subtitle}>
          Choose a method to practice. Complete at least 3 out of 6 problems
          in each activity to finish that challenge.
        </p>
        <div style={styles.cards}>
          {activities.map(a => (
            <ActivityCard key={a.id} activity={a} onSelect={setActive} />
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

export default function App() {
  const [active, setActive] = useState(null)

  // Clear conditional: only ONE view renders at a time
  if (active !== null) {
    return <ActivityView active={active} setActive={setActive} activities={activities} />
  }

  return <LandingPage setActive={setActive} activities={activities} />
}

function ActivityCard({ activity: a, onSelect }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={() => onSelect(a.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
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
        <span style={styles.cardFooterLabel}>6 problems · Socratic guide</span>
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

const styles = {
  wrapper: {
    display: 'flex', 
    flexDirection: 'column',
    height: '100vh', 
    width: '100vw',
    background: '#080d1c',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 100,
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
