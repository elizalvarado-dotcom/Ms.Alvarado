import { S } from './styles.js'
import { T } from './i18n.js'

export default function NameFields({ lang, value, onChange }) {
  const t = T[lang]

  return (
    <div style={{ ...S.toolCard, marginBottom: '20px' }}>
      <div style={{ ...S.lessonHeading, fontSize: '1rem', marginBottom: '14px' }}>{t.nameFieldsTitle}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: '14px' }}>
        <div style={S.fieldWrap}>
          <label style={S.label}>{t.firstNameLabel}</label>
          <input
            style={S.input} value={value.firstName} placeholder={t.firstNamePh}
            onChange={e => onChange('firstName', e.target.value)} autoComplete="given-name"
          />
        </div>
        <div style={S.fieldWrap}>
          <label style={S.label}>{t.lastNameLabel}</label>
          <input
            style={S.input} value={value.lastName} placeholder={t.lastNamePh}
            onChange={e => onChange('lastName', e.target.value)} autoComplete="family-name"
          />
        </div>
        <div style={S.fieldWrap}>
          <label style={S.label}>{t.periodLabel}</label>
          <input
            style={S.input} value={value.period} placeholder={t.periodPh}
            onChange={e => onChange('period', e.target.value)} inputMode="numeric" type="text"
          />
        </div>
      </div>
    </div>
  )
}
