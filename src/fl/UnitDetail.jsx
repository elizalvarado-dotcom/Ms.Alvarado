import { useState } from 'react'
import { S } from './styles.js'
import { T, L } from './i18n.js'

function ClassworkCard({ unit, mod, lang, progress, onOpen }) {
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
        borderColor: hov ? unit.colorBorder : 'rgba(28,43,35,0.12)',
        background: hov ? unit.colorDim : '#fffdf7',
        transform: hov ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hov ? `0 18px 36px rgba(28,43,35,.14), 0 0 0 1px ${unit.colorBorder}` : '0 2px 10px rgba(28,43,35,.05)',
        borderTop: `4px solid ${unit.color}`,
      }}
    >
      <div style={{ ...S.moduleIcon, background: unit.colorDim, border: `1px solid ${unit.colorBorder}` }}>{unit.icon}</div>
      <div style={S.moduleTitle}>{L(mod.title, lang)}</div>
      <div style={S.moduleTagline}>{L(mod.tagline, lang)}</div>
      {completed && (
        <div style={{ display: 'inline-flex', alignSelf: 'flex-start', padding: '3px 12px', borderRadius: '20px', background: 'rgba(27,122,77,0.12)', border: '1px solid rgba(27,122,77,0.35)', fontSize: '.72rem', fontWeight: 700, color: '#1b7a4d' }}>
          {t.scoreOf(p.score, p.total)}
        </div>
      )}
      <div style={S.moduleFooter}>
        <span>{t.questionsCount(mod.quiz.length)}</span>
        <span style={{ color: unit.color, fontWeight: 700 }}>{completed ? t.reviewModule : t.startModule} →</span>
      </div>
    </button>
  )
}

export default function UnitDetail({ unit, lang, progress, onBack, onOpenModule }) {
  const t = T[lang]

  return (
    <div style={S.pageInner}>
      <button style={S.backLink} onClick={onBack}>{t.backToUnits}</button>

      <div style={{ marginBottom: '28px' }}>
        <div style={{ ...S.moduleIcon, background: unit.colorDim, border: `1px solid ${unit.colorBorder}`, marginBottom: '14px' }}>{unit.icon}</div>
        <h2 style={S.greetName}>{L(unit.title, lang)}</h2>
        <p style={S.greetSub}>{L(unit.tagline, lang)}</p>
      </div>

      {unit.modules.length === 0 ? (
        <div style={{ ...S.lessonCard, textAlign: 'center', padding: '48px 28px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🚧</div>
          <div style={{ ...S.lessonHeading, marginBottom: '6px' }}>{t.comingSoonTitle}</div>
          <p style={{ ...S.lessonPara, marginBottom: 0 }}>{t.comingSoonSub}</p>
        </div>
      ) : (
        <div style={S.moduleGrid}>
          {unit.modules.map(mod => (
            <ClassworkCard key={mod.id} unit={unit} mod={mod} lang={lang} progress={progress} onOpen={onOpenModule} />
          ))}
        </div>
      )}
    </div>
  )
}
