import { useState } from 'react'
import { S } from './styles.js'
import { T, L } from './i18n.js'
import BudgetTool from './BudgetTool.jsx'
import InterestTool from './InterestTool.jsx'
import NameFields from './NameFields.jsx'
import { downloadQuizReportPdf } from './pdf.js'

const MAX_POINTS = 10
const DEDUCTION = 4

function Quiz({ mod, lang, onComplete }) {
  const t = T[lang]
  const questions = mod.quiz
  const [idx, setIdx] = useState(0)
  const [wrongTries, setWrongTries] = useState([])
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false)
  const [results, setResults] = useState([])

  const q = questions[idx]
  const currentValue = Math.max(0, MAX_POINTS - wrongTries.length * DEDUCTION)

  function pick(i) {
    if (answeredCorrectly || wrongTries.includes(i)) return
    if (i === q.correct) {
      setAnsweredCorrectly(true)
      setResults(r => [...r, {
        question: L(q.q, lang),
        correctAnswer: L(q.choices[q.correct], lang),
        attempts: wrongTries.length + 1,
        points: currentValue,
      }])
    } else {
      setWrongTries(w => [...w, i])
    }
  }

  function next() {
    if (idx + 1 < questions.length) {
      setIdx(i => i + 1)
      setWrongTries([])
      setAnsweredCorrectly(false)
    } else {
      const max = questions.length * MAX_POINTS
      const earned = results.reduce((sum, r) => sum + r.points, 0)
      const percentage = max > 0 ? Math.round((earned / max) * 100) : 0
      onComplete({ earned, max, percentage, perQuestion: results })
    }
  }

  return (
    <div style={S.quizCard}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '14px' }}>
        <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: '.72rem', fontWeight: 800, letterSpacing: '1.2px', textTransform: 'uppercase', color: mod.color }}>
          {t.question} {idx + 1} / {questions.length}
        </span>
        {!answeredCorrectly && (
          <span style={{ fontSize: '.75rem', fontWeight: 700, color: '#a3790a' }}>{t.pointsEarned(currentValue, MAX_POINTS)}</span>
        )}
      </div>
      <p style={{ fontSize: '1.02rem', fontWeight: 700, marginBottom: '18px', lineHeight: 1.5 }}>{L(q.q, lang)}</p>

      {q.choices.map((c, i) => {
        let extraStyle = {}
        if (wrongTries.includes(i)) extraStyle = { ...S.choiceWrong, opacity: 0.6, cursor: 'default', textDecoration: 'line-through' }
        else if (answeredCorrectly && i === q.correct) extraStyle = S.choiceCorrect
        return (
          <button
            key={i} style={{ ...S.choiceBtn, ...extraStyle }} onClick={() => pick(i)}
            disabled={answeredCorrectly || wrongTries.includes(i)}
          >
            {L(c, lang)}
          </button>
        )
      })}

      {wrongTries.length > 0 && !answeredCorrectly && (
        <p style={{ fontWeight: 700, color: '#7a2e3a', marginTop: '4px' }}>{t.incorrect}</p>
      )}

      {answeredCorrectly && (
        <div style={{
          marginTop: '10px', padding: '14px 16px', borderRadius: '14px',
          background: 'rgba(27,122,77,0.1)', border: '1px solid rgba(27,122,77,0.3)',
        }}>
          <p style={{ fontWeight: 800, marginBottom: '6px', color: '#1b7a4d' }}>
            {t.correct} {t.pointsEarned(currentValue, MAX_POINTS)}
          </p>
          <p style={{ fontSize: '.85rem', color: '#3c4a41', lineHeight: 1.5 }}>{L(q.explain, lang)}</p>
          <button style={{ ...S.primaryBtn, marginTop: '14px', background: mod.color, color: '#fdf8ec' }} onClick={next}>
            {idx + 1 < questions.length ? t.nextQuestion : t.finishModule}
          </button>
        </div>
      )}
    </div>
  )
}

function QuizReport({ lang, unitTitle, mod, studentInfo, report }) {
  const t = T[lang]
  const moduleTitle = L(mod.title, lang)
  const [downloading, setDownloading] = useState(false)

  async function handleDownload() {
    setDownloading(true)
    try {
      await downloadQuizReportPdf({
        lang, unitTitle, moduleTitle, studentInfo,
        earned: report.earned, max: report.max, percentage: report.percentage,
        results: report.perQuestion,
      })
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div style={S.quizCard}>
      <h3 style={{ ...S.lessonHeading, fontSize: '1.3rem' }}>{t.quizComplete}</h3>
      <p style={{ ...S.lessonPara, marginBottom: '6px' }}>{t.quizCompleteSub(report.percentage)}</p>
      <p style={{ fontWeight: 800, fontSize: '1.4rem', color: '#1b7a4d', marginBottom: '18px' }}>
        {report.percentage}% <span style={{ fontSize: '.85rem', fontWeight: 700, color: '#5b6b62' }}>({t.pointsEarned(report.earned, report.max)})</span>
      </p>

      <div style={{ ...S.eyebrow, marginBottom: '10px' }}>{t.breakdownLabel}</div>
      {report.perQuestion.map((r, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', padding: '8px 0', borderBottom: i < report.perQuestion.length - 1 ? '1px solid rgba(28,43,35,0.08)' : 'none', fontSize: '.85rem' }}>
          <span style={{ color: '#3c4a41' }}>{t.question} {i + 1}: {r.question}</span>
          <span style={{ whiteSpace: 'nowrap', fontWeight: 700, color: r.points === MAX_POINTS ? '#1b7a4d' : '#a3790a' }}>
            {t.attemptsLabel(r.attempts)} · {r.points}/{MAX_POINTS}
          </span>
        </div>
      ))}

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '20px' }}>
        <button
          style={{ ...S.primaryBtn, width: 'auto', flex: '1 1 200px', background: 'linear-gradient(135deg,#a3790a,#8a6408)', opacity: downloading ? 0.7 : 1 }}
          onClick={handleDownload}
          disabled={downloading}
        >
          {downloading ? '…' : t.downloadPdf}
        </button>
      </div>
    </div>
  )
}

export default function ModuleView({ mod, unitTitle, lang, onBack, onCompleteQuiz }) {
  const t = T[lang]
  const [studentInfo, setStudentInfo] = useState({ firstName: '', lastName: '', period: '' })
  const [report, setReport] = useState(null)
  const [attempt, setAttempt] = useState(0)

  function handleNameChange(field, value) {
    setStudentInfo(s => ({ ...s, [field]: value }))
  }

  function handleComplete(result) {
    setReport(result)
    onCompleteQuiz(mod.id, result.earned, result.max)
  }

  function retake() {
    setReport(null)
    setAttempt(a => a + 1)
  }

  return (
    <div style={S.pageInner}>
      <button style={S.backLink} onClick={onBack}>{t.backToModules}</button>

      <div style={{ marginBottom: '24px' }}>
        <div style={{ ...S.moduleIcon, background: mod.colorDim, border: `1px solid ${mod.colorBorder}`, marginBottom: '14px' }}>{mod.icon}</div>
        <h2 style={S.greetName}>{L(mod.title, lang)}</h2>
        <p style={S.greetSub}>{L(mod.tagline, lang)}</p>
      </div>

      <NameFields lang={lang} value={studentInfo} onChange={handleNameChange} />

      <div style={{ ...S.eyebrow, marginBottom: '14px' }}>{t.lessonLabel}</div>
      {mod.lesson.map((sec, i) => (
        <div key={i} style={S.lessonCard}>
          <div style={S.lessonHeading}>{L(sec.heading, lang)}</div>
          {L(sec.body, lang).map((p, j) => <p key={j} style={S.lessonPara}>{p}</p>)}
          {sec.resources?.map((r, j) => (
            <a
              key={j} href={r.url} target="_blank" rel="noopener noreferrer"
              style={{
                display: 'inline-block', marginTop: '6px', marginRight: '10px', fontSize: '.85rem', fontWeight: 700,
                color: mod.color, textDecoration: 'none', borderBottom: `1px solid ${mod.color}`, paddingBottom: '1px',
              }}
            >
              {L(r.label, lang)}
            </a>
          ))}
        </div>
      ))}

      {mod.tool === 'budget' && (
        <>
          <div style={{ ...S.eyebrow, marginBottom: '14px', marginTop: '30px' }}>{t.tryTool}</div>
          <BudgetTool lang={lang} />
        </>
      )}
      {mod.tool === 'interest' && (
        <>
          <div style={{ ...S.eyebrow, marginBottom: '14px', marginTop: '30px' }}>{t.tryTool}</div>
          <InterestTool lang={lang} />
        </>
      )}

      <div style={{ ...S.eyebrow, marginBottom: '14px', marginTop: '30px' }}>{t.quizLabel}</div>

      {report ? (
        <>
          <QuizReport lang={lang} unitTitle={unitTitle} mod={mod} studentInfo={studentInfo} report={report} />
          <button type="button" style={{ ...S.linkBtn, marginTop: '14px' }} onClick={retake}>{t.retakeQuiz}</button>
        </>
      ) : (
        <Quiz key={attempt} mod={mod} lang={lang} onComplete={handleComplete} />
      )}
    </div>
  )
}
