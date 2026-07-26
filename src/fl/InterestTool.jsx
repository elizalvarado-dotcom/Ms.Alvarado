import { useState } from 'react'
import { S } from './styles.js'
import { T } from './i18n.js'

export default function InterestTool({ lang }) {
  const t = T[lang]
  const [principal, setPrincipal] = useState('1000')
  const [rate, setRate] = useState('5')
  const [years, setYears] = useState('10')
  const [n, setN] = useState('12')

  const P = parseFloat(principal) || 0
  const r = (parseFloat(rate) || 0) / 100
  const t_ = parseFloat(years) || 0
  const nVal = parseFloat(n) || 1

  const futureValue = P * Math.pow(1 + r / nVal, nVal * t_)
  const interestEarned = futureValue - P

  const fmt = v => v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <div style={S.toolCard}>
      <div style={{ ...S.lessonHeading, fontSize: '1.2rem', marginBottom: '4px' }}>{t.interestToolTitle}</div>
      <p style={{ ...S.lessonPara, marginBottom: '20px' }}>{t.interestToolSub}</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '14px' }}>
        <div style={S.fieldWrap}>
          <label style={S.label}>{t.principal}</label>
          <input type="number" min="0" style={S.input} value={principal} onChange={e => setPrincipal(e.target.value)} />
        </div>
        <div style={S.fieldWrap}>
          <label style={S.label}>{t.rate}</label>
          <input type="number" min="0" step="0.1" style={S.input} value={rate} onChange={e => setRate(e.target.value)} />
        </div>
        <div style={S.fieldWrap}>
          <label style={S.label}>{t.years}</label>
          <input type="number" min="0" style={S.input} value={years} onChange={e => setYears(e.target.value)} />
        </div>
        <div style={S.fieldWrap}>
          <label style={S.label}>{t.compoundsPerYear}</label>
          <select style={S.select} value={n} onChange={e => setN(e.target.value)}>
            <option value="1">1 ({lang === 'es' ? 'anual' : 'annually'})</option>
            <option value="4">4 ({lang === 'es' ? 'trimestral' : 'quarterly'})</option>
            <option value="12">12 ({lang === 'es' ? 'mensual' : 'monthly'})</option>
            <option value="365">365 ({lang === 'es' ? 'diario' : 'daily'})</option>
          </select>
        </div>
      </div>

      <div style={{ marginTop: '18px', padding: '16px', borderRadius: '14px', background: 'rgba(163,121,10,0.08)', border: '1px solid rgba(163,121,10,0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.9rem', marginBottom: '8px' }}>
          <span style={{ color: '#5b6b62' }}>{t.futureValue}</span>
          <strong style={{ color: '#a3790a', fontSize: '1.1rem' }}>${fmt(futureValue)}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.9rem' }}>
          <span style={{ color: '#5b6b62' }}>{t.totalInterestEarned}</span>
          <strong style={{ color: '#1b7a4d' }}>${fmt(interestEarned)}</strong>
        </div>
      </div>
    </div>
  )
}
