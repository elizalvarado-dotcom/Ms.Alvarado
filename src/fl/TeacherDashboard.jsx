import { S } from './styles.js'
import { T, L } from './i18n.js'
import { MODULES } from './lessons.js'
import LangToggle from './LangToggle.jsx'

export default function TeacherDashboard({ lang, setLang, onSignOut }) {
  const t = T[lang]

  return (
    <div style={S.page}>
      <div style={S.blob1} /><div style={S.blob2} /><div style={S.blob3} />
      <div style={S.header}>
        <div style={S.headerLeft}>
          <div style={S.headerLogo}>🔑</div>
          <span style={S.headerName}>{t.dashboard}</span>
        </div>
        <div style={S.headerRight}>
          <LangToggle lang={lang} setLang={setLang} />
          <button style={S.navBtn} onClick={onSignOut}>{t.signOut}</button>
        </div>
      </div>

      <div style={S.pageInner}>
        <h2 style={S.greetName}>{t.dashTitle}</h2>
        <p style={S.greetSub}>{t.dashSub}</p>

        {MODULES.map(mod => (
          <div key={mod.id} style={{ marginBottom: '36px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ ...S.moduleIcon, width: '40px', height: '40px', fontSize: '1.1rem', background: mod.colorDim, border: `1px solid ${mod.colorBorder}` }}>{mod.icon}</div>
              <div style={{ ...S.moduleTitle, color: mod.color }}>{L(mod.title, lang)}</div>
            </div>

            {mod.quiz.map((q, i) => (
              <div key={i} style={{ ...S.lessonCard, marginBottom: '12px' }}>
                <p style={{ fontWeight: 700, marginBottom: '10px' }}>
                  {t.question} {i + 1}: {L(q.q, lang)}
                </p>
                {q.choices.map((c, ci) => (
                  <div
                    key={ci}
                    style={{
                      padding: '8px 14px', borderRadius: '10px', marginBottom: '6px', fontSize: '.88rem',
                      background: ci === q.correct ? 'rgba(27,122,77,0.12)' : 'rgba(28,43,35,0.03)',
                      border: `1px solid ${ci === q.correct ? 'rgba(27,122,77,0.4)' : 'rgba(28,43,35,0.10)'}`,
                      color: ci === q.correct ? '#1b7a4d' : '#3c4a41',
                      fontWeight: ci === q.correct ? 700 : 400,
                    }}
                  >
                    {ci === q.correct ? '✓ ' : ''}{L(c, lang)}
                  </div>
                ))}
                <p style={{ fontSize: '.82rem', color: '#5b6b62', marginTop: '8px', lineHeight: 1.5 }}>{L(q.explain, lang)}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
