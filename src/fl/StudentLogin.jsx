import { useState } from 'react'
import { S } from './styles.js'
import { T } from './i18n.js'
import LangToggle from './LangToggle.jsx'

export default function StudentLogin({ lang, setLang, onLogin, onTeacherClick, loading }) {
  const t = T[lang]
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [period, setPeriod] = useState('')
  const [error, setError] = useState(null)

  function handleSubmit(e) {
    e.preventDefault()
    if (!firstName.trim() || !lastName.trim() || !period.toString().trim()) {
      setError(t.fillAllFields)
      return
    }
    setError(null)
    onLogin({ firstName: firstName.trim(), lastName: lastName.trim(), period: period.toString().trim() })
  }

  return (
    <div style={S.page}>
      <div style={S.blob1} /><div style={S.blob2} /><div style={S.blob3} />
      <div style={{ position: 'absolute', top: '20px', right: '24px', zIndex: 2 }}>
        <LangToggle lang={lang} setLang={setLang} />
      </div>
      <div style={S.centerWrap}>
        <form style={S.card} onSubmit={handleSubmit}>
          <div style={S.logoBox}>💵</div>
          <p style={S.eyebrow}>{t.siteTag}</p>
          <h1 style={S.title}>{t.loginTitle}</h1>
          <p style={S.sub}>{t.loginSub}</p>

          {error && <p style={S.errText}>{error}</p>}

          <div style={S.fieldWrap}>
            <label style={S.label}>{t.firstNameLabel}</label>
            <input
              style={S.input} value={firstName} placeholder={t.firstNamePh}
              onChange={e => setFirstName(e.target.value)} autoComplete="given-name"
            />
          </div>
          <div style={S.fieldWrap}>
            <label style={S.label}>{t.lastNameLabel}</label>
            <input
              style={S.input} value={lastName} placeholder={t.lastNamePh}
              onChange={e => setLastName(e.target.value)} autoComplete="family-name"
            />
          </div>
          <div style={S.fieldWrap}>
            <label style={S.label}>{t.periodLabel}</label>
            <input
              style={S.input} value={period} placeholder={t.periodPh}
              onChange={e => setPeriod(e.target.value)} inputMode="numeric" type="text"
            />
          </div>

          <button type="submit" style={{ ...S.primaryBtn, opacity: loading ? .65 : 1 }} disabled={loading}>
            {loading ? '…' : t.startBtn}
          </button>

          <button type="button" style={S.linkBtn} onClick={onTeacherClick}>
            {t.teacherLoginLink}
          </button>
        </form>
      </div>
    </div>
  )
}
