import { useState } from 'react'
import { S } from './styles.js'
import { T, L } from './i18n.js'
import { UNITS } from './lessons.js'
import LangToggle from './LangToggle.jsx'

function UnitCard({ unit, lang, onOpen }) {
  const [hov, setHov] = useState(false)
  const t = T[lang]
  const count = unit.modules.length

  return (
    <button
      onClick={() => onOpen(unit.id)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        ...S.moduleCard,
        borderColor: hov ? unit.colorBorder : 'rgba(28,43,35,0.12)',
        background: hov ? unit.colorDim : '#fffdf7',
        transform: hov ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hov ? `0 18px 36px rgba(28,43,35,.14), 0 0 0 1px ${unit.colorBorder}` : '0 2px 10px rgba(28,43,35,.05)',
        borderTop: `4px solid ${unit.color}`,
      }}
    >
      <div style={{ ...S.moduleIcon, background: unit.colorDim, border: `1px solid ${unit.colorBorder}` }}>{unit.icon}</div>
      <div style={S.moduleTitle}>{L(unit.title, lang)}</div>
      <div style={S.moduleTagline}>{L(unit.tagline, lang)}</div>
      {count === 0 && (
        <div style={{ display: 'inline-flex', alignSelf: 'flex-start', padding: '3px 12px', borderRadius: '20px', background: 'rgba(28,43,35,0.05)', border: '1px solid rgba(28,43,35,0.14)', fontSize: '.72rem', fontWeight: 700, color: '#5b6b62' }}>
          {t.comingSoonBadge}
        </div>
      )}
      <div style={S.moduleFooter}>
        <span>{t.classworkCount(count)}</span>
        <span style={{ color: unit.color, fontWeight: 700 }}>{t.exploreUnit} →</span>
      </div>
    </button>
  )
}

export default function Home({ lang, setLang, onOpenUnit, onTeacherClick }) {
  const t = T[lang]

  return (
    <div style={S.page}>
      <div style={S.blob1} /><div style={S.blob2} /><div style={S.blob3} />
      <div style={S.header}>
        <div style={S.headerLeft}>
          <div style={S.headerLogo}>💵</div>
          <span style={S.headerName}>{t.siteName}</span>
        </div>
        <div style={S.headerRight}>
          <LangToggle lang={lang} setLang={setLang} />
          <button style={S.navBtn} onClick={onTeacherClick}>🔒 {t.teacherLoginLink}</button>
        </div>
      </div>

      <div style={S.pageInner}>
        <div style={S.greetEyebrow}>{t.siteTag}</div>
        <h2 style={S.greetName}>{t.greeting} 👋</h2>
        <p style={S.greetSub}>{t.greetingSub}</p>

        <div style={S.moduleGrid}>
          {UNITS.map(unit => (
            <UnitCard key={unit.id} unit={unit} lang={lang} onOpen={onOpenUnit} />
          ))}
        </div>
      </div>
    </div>
  )
}
