import { useState } from 'react'
import { S } from './styles.js'
import { T } from './i18n.js'

export default function NameFields({ lang }) {
  const t = T[lang]
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [period, setPeriod] = useState('')

  return (
    <div style={{ ...S.toolCard, marginBottom: '20px' }}>
      <div style={{ ...S.lessonHeading, fontSize: '1rem', marginBottom: '14px' }}>{t.nameFieldsTitle}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: '14px' }}>
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
      </div>
    </div>
  )
}
