import { useState } from 'react'
import { S } from './styles.js'
import { T } from './i18n.js'

const CATEGORIES = ['housing', 'food', 'transportation', 'savings', 'fun', 'other']

export default function BudgetTool({ lang, saved, onSave }) {
  const t = T[lang]
  const [income, setIncome] = useState(saved?.income ?? '')
  const [alloc, setAlloc] = useState(saved?.alloc ?? { housing: '', food: '', transportation: '', savings: '', fun: '', other: '' })
  const [savedFlash, setSavedFlash] = useState(false)

  const num = v => (v === '' || v === undefined ? 0 : parseFloat(v) || 0)
  const total = CATEGORIES.reduce((sum, c) => sum + num(alloc[c]), 0)
  const remaining = num(income) - total
  const over = remaining < -0.001

  function setCat(cat, val) {
    setAlloc(a => ({ ...a, [cat]: val }))
  }

  function handleSave() {
    onSave({ income: num(income), alloc, remaining, total })
    setSavedFlash(true)
    setTimeout(() => setSavedFlash(false), 1800)
  }

  return (
    <div style={S.toolCard}>
      <div style={{ ...S.lessonHeading, fontSize: '1.2rem', marginBottom: '4px' }}>{t.budgetToolTitle}</div>
      <p style={{ ...S.lessonPara, marginBottom: '20px' }}>{t.budgetToolSub}</p>

      <div style={S.fieldWrap}>
        <label style={S.label}>{t.monthlyIncome}</label>
        <input
          type="number" min="0" style={S.input} value={income}
          onChange={e => setIncome(e.target.value)} placeholder="2000"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '14px', marginTop: '10px' }}>
        {CATEGORIES.map(cat => (
          <div key={cat} style={S.fieldWrap}>
            <label style={S.label}>{t[`category_${cat}`]}</label>
            <input
              type="number" min="0" style={S.input} value={alloc[cat]}
              onChange={e => setCat(cat, e.target.value)} placeholder="0"
            />
          </div>
        ))}
      </div>

      <div style={{
        marginTop: '18px', padding: '16px', borderRadius: '14px',
        background: over ? 'rgba(248,113,113,0.08)' : 'rgba(52,211,153,0.08)',
        border: `1px solid ${over ? 'rgba(248,113,113,0.3)' : 'rgba(52,211,153,0.3)'}`,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.88rem', marginBottom: '6px' }}>
          <span style={{ color: '#8a96b8' }}>{t.totalAllocated}</span>
          <strong>${total.toLocaleString(undefined, { maximumFractionDigits: 2 })}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.88rem' }}>
          <span style={{ color: '#8a96b8' }}>{t.remaining}</span>
          <strong style={{ color: over ? '#f87171' : '#34d399' }}>
            ${remaining.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </strong>
        </div>
        <p style={{ marginTop: '10px', fontSize: '.85rem', fontWeight: 700, color: over ? '#f87171' : '#34d399' }}>
          {over ? t.overBudget : (num(income) > 0 && Math.abs(remaining) < 0.01 ? t.perfectBudget : '')}
        </p>
      </div>

      <button style={{ ...S.primaryBtn, marginTop: '18px' }} onClick={handleSave}>
        {savedFlash ? t.budgetSaved : t.saveBudget}
      </button>
    </div>
  )
}
