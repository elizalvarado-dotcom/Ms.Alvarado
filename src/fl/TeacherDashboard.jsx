import { useState, useEffect, useMemo } from 'react'
import { S } from './styles.js'
import { T, L } from './i18n.js'
import { MODULES } from './lessons.js'
import { subscribeAllStudents } from './db.js'
import LangToggle from './LangToggle.jsx'

function downloadCSV(filename, rows) {
  const csv = rows.map(r => r.map(c => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(a.href)
}

export default function TeacherDashboard({ lang, setLang, onSignOut }) {
  const t = T[lang]
  const [students, setStudents] = useState(null)
  const [periodFilter, setPeriodFilter] = useState('all')

  useEffect(() => {
    const unsub = subscribeAllStudents(setStudents)
    return unsub
  }, [])

  const rows = students || []
  const allPeriods = useMemo(
    () => [...new Set((students || []).map(r => r.period).filter(Boolean))].sort(),
    [students]
  )
  const filtered = periodFilter === 'all' ? rows : rows.filter(r => r.period === periodFilter)

  function overallPct(r) {
    let earned = 0, max = 0
    MODULES.forEach(mod => {
      const p = r.progress?.[mod.id]
      if (p?.completed) { earned += p.score; max += p.total }
    })
    return max > 0 ? Math.round((earned / max) * 100) : null
  }

  function exportCsv() {
    const hdrs = ['Student', 'Period', ...MODULES.flatMap(m => [`${L(m.title, 'en')} Score`, `${L(m.title, 'en')} Max`]), 'Overall %']
    const data = filtered.map(r => {
      const cells = MODULES.flatMap(mod => {
        const p = r.progress?.[mod.id]
        return [p?.completed ? p.score : '', p?.completed ? p.total : '']
      })
      const pct = overallPct(r)
      return [`${r.firstName} ${r.lastName}`, r.period || '', ...cells, pct !== null ? pct + '%' : '']
    })
    downloadCSV('money-matters-progress.csv', [hdrs, ...data])
  }

  return (
    <div style={S.page}>
      <div style={S.blob1} /><div style={S.blob2} /><div style={S.blob3} />
      <div style={S.header}>
        <div style={S.headerLeft}>
          <div style={S.headerLogo}>📊</div>
          <span style={S.headerName}>{t.dashboard}</span>
        </div>
        <div style={S.headerRight}>
          <LangToggle lang={lang} setLang={setLang} />
          <button style={S.navBtn} onClick={exportCsv}>⬇ {t.exportCsv}</button>
          <button style={S.navBtn} onClick={onSignOut}>{t.signOut}</button>
        </div>
      </div>

      <div style={S.pageInner}>
        <h2 style={S.greetName}>{t.dashTitle}</h2>
        <p style={S.greetSub}>{t.dashSub}</p>

        {allPeriods.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
            {['all', ...allPeriods].map(p => (
              <button
                key={p}
                onClick={() => setPeriodFilter(p)}
                style={{
                  padding: '6px 14px', borderRadius: '20px', cursor: 'pointer', fontSize: '.8rem', fontWeight: 700,
                  border: `1px solid ${periodFilter === p ? 'rgba(52,211,153,0.45)' : 'rgba(255,255,255,0.08)'}`,
                  background: periodFilter === p ? 'rgba(52,211,153,0.15)' : 'rgba(255,255,255,0.03)',
                  color: periodFilter === p ? '#34d399' : '#8a96b8',
                }}
              >
                {p === 'all' ? t.allPeriods : t.periodBadge(p)}
              </button>
            ))}
          </div>
        )}

        <div style={{ ...S.lessonCard, padding: '10px 8px' }}>
          {students === null ? (
            <p style={{ padding: '20px', color: '#8a96b8' }}>…</p>
          ) : filtered.length === 0 ? (
            <p style={{ padding: '20px', color: '#8a96b8' }}>{t.noStudents}</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={S.table}>
                <thead>
                  <tr>
                    <th style={S.th}>{t.studentCol}</th>
                    <th style={S.th}>{t.periodCol}</th>
                    {MODULES.map(mod => (
                      <th key={mod.id} style={{ ...S.th, color: mod.color }}>{L(mod.title, lang)}</th>
                    ))}
                    <th style={S.th}>{t.avgScore}</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(r => {
                    const pct = overallPct(r)
                    return (
                      <tr key={r.uid}>
                        <td style={S.td}>{r.firstName} {r.lastName}</td>
                        <td style={S.td}>{r.period || '—'}</td>
                        {MODULES.map(mod => {
                          const p = r.progress?.[mod.id]
                          return (
                            <td key={mod.id} style={S.td}>
                              {p?.completed ? `${p.score}/${p.total}` : '—'}
                            </td>
                          )
                        })}
                        <td style={{ ...S.td, fontWeight: 700, color: pct === null ? '#6b7a9a' : pct >= 75 ? '#34d399' : pct >= 50 ? '#e8a832' : '#f87171' }}>
                          {pct !== null ? `${pct}%` : '—'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <p style={{ marginTop: '14px', color: '#6b7a9a', fontSize: '.82rem' }}>{t.studentsCount(filtered.length)}</p>
      </div>
    </div>
  )
}
