import { useState } from 'react'
import { S } from './styles.js'
import { T, L } from './i18n.js'
import { MODULES } from './lessons.js'
import LangToggle from './LangToggle.jsx'

function ModuleCard({ mod, lang, progress, onOpen }) {
  const [hov, setHov] = useState(false)
  const t = T[lang]
  const p = progress?.[mod.id]
  const completed = !!p?.completed

  return (
    <button
      onClick={() => onOpen(mod.id)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        ...S.moduleCard,
        borderColor: hov ? mod.colorBorder : 'rgba(28,43,35,0.12)',
        background: hov ? mod.colorDim : '#fffdf7',
        transform: hov ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hov ? `0 18px 36px rgba(28,43,35,.14), 0 0 0 1px ${mod.colorBorder}` : '0 2px 10px rgba(28,43,35,.05)',
        borderTop: `4px solid ${mod.color}`,
      }}
    >
      <div style={{ ...S.moduleIcon, background: mod.colorDim, border: `1px solid ${mod.colorBorder}` }}>{mod.icon}</div>
      <div style={S.moduleTitle}>{L(mod.title, lang)}</div>
      <div style={S.moduleTagline}>{L(mod.tagline, lang)}</div>
      {completed && (
        <div style={{ display: 'inline-flex', alignSelf: 'flex-start', padding: '3px 12px', borderRadius: '20px', background: 'rgba(27,122,77,0.12)', border: '1px solid rgba(27,122,77,0.35)', fontSize: '.72rem', fontWeight: 700, color: '#1b7a4d' }}>
          {t.scoreOf(p.score, p.total)}
        </div>
      )}
      <div style={S.moduleFooter}>
        <span>{t.questionsCount(mod.quiz.length)}</span>
        <span style={{ color: mod.color, fontWeight: 700 }}>{completed ? t.reviewModule : t.startModule} →</span>
      </div>
    </button>
  )
}

export default function Home({ lang, setLang, progress, onOpenModule, onTeacherClick }) {
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
          <a href="/" style={{ ...S.navBtn, textDecoration: 'none', display: 'inline-block' }}>{t.backToAlgebra}</a>
          <button style={S.navBtn} onClick={onTeacherClick}>🔒 {t.teacherLoginLink}</button>
        </div>
      </div>

      <div style={S.pageInner}>
        <div style={S.greetEyebrow}>{t.siteTag}</div>
        <h2 style={S.greetName}>{t.greeting} 👋</h2>
        <p style={S.greetSub}>{t.greetingSub}</p>

        <div style={S.moduleGrid}>
          {MODULES.map(mod => (
            <ModuleCard key={mod.id} mod={mod} lang={lang} progress={progress} onOpen={onOpenModule} />
          ))}
        </div>
      </div>
    </div>
  )
}
