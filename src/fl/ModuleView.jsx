import { useState } from 'react'
import { S } from './styles.js'
import { T, L } from './i18n.js'
import BudgetTool from './BudgetTool.jsx'
import InterestTool from './InterestTool.jsx'
import NameFields from './NameFields.jsx'

function Quiz({ mod, lang, onComplete }) {
  const t = T[lang]
  const questions = mod.quiz
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const [finalScore, setFinalScore] = useState(null)

  const q = questions[idx]

  function pick(i) {
    if (answered) return
    setSelected(i)
    setAnswered(true)
    if (i === q.correct) setScore(s => s + 1)
  }

  function next() {
    if (idx + 1 < questions.length) {
      setIdx(i => i + 1)
      setSelected(null)
      setAnswered(false)
    } else {
      setFinalScore(score)
      setDone(true)
      onComplete(score, questions.length)
    }
  }

  function retake() {
    setIdx(0); setSelected(null); setAnswered(false); setScore(0); setDone(false); setFinalScore(null)
  }

  if (done) {
    return (
      <div style={S.quizCard}>
        <h3 style={{ ...S.lessonHeading, fontSize: '1.3rem' }}>{t.quizComplete}</h3>
        <p style={{ ...S.lessonPara, marginBottom: '18px' }}>{t.quizCompleteSub(finalScore, questions.length)}</p>
        <button style={{ ...S.primaryBtn, background: 'linear-gradient(135deg,#a78bfa,#8b5cf6)', color: '#160f2b' }} onClick={retake}>
          {t.retakeQuiz}
        </button>
      </div>
    )
  }

  return (
    <div style={S.quizCard}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '14px' }}>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.72rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: mod.color }}>
          {t.question} {idx + 1} / {questions.length}
        </span>
      </div>
      <p style={{ fontSize: '1.02rem', fontWeight: 700, marginBottom: '18px', lineHeight: 1.5 }}>{L(q.q, lang)}</p>

      {q.choices.map((c, i) => {
        let extraStyle = {}
        if (answered) {
          if (i === q.correct) extraStyle = S.choiceCorrect
          else if (i === selected) extraStyle = S.choiceWrong
        }
        return (
          <button key={i} style={{ ...S.choiceBtn, ...extraStyle }} onClick={() => pick(i)} disabled={answered}>
            {L(c, lang)}
          </button>
        )
      })}

      {answered && (
        <div style={{
          marginTop: '10px', padding: '14px 16px', borderRadius: '14px',
          background: selected === q.correct ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)',
          border: `1px solid ${selected === q.correct ? 'rgba(52,211,153,0.3)' : 'rgba(248,113,113,0.3)'}`,
        }}>
          <p style={{ fontWeight: 800, marginBottom: '6px', color: selected === q.correct ? '#34d399' : '#f87171' }}>
            {selected === q.correct ? t.correct : t.incorrect}
          </p>
          <p style={{ fontSize: '.85rem', color: '#c3cadd', lineHeight: 1.5 }}>{L(q.explain, lang)}</p>
          <button style={{ ...S.primaryBtn, marginTop: '14px', background: mod.color, color: '#04150f' }} onClick={next}>
            {idx + 1 < questions.length ? t.nextQuestion : t.finishModule}
          </button>
        </div>
      )}
    </div>
  )
}

export default function ModuleView({ mod, lang, onBack, onCompleteQuiz }) {
  const t = T[lang]

  return (
    <div style={S.pageInner}>
      <button style={S.backLink} onClick={onBack}>{t.backToModules}</button>

      <div style={{ marginBottom: '24px' }}>
        <div style={{ ...S.moduleIcon, background: mod.colorDim, border: `1px solid ${mod.colorBorder}`, marginBottom: '14px' }}>{mod.icon}</div>
        <h2 style={S.greetName}>{L(mod.title, lang)}</h2>
        <p style={S.greetSub}>{L(mod.tagline, lang)}</p>
      </div>

      <div style={{ ...S.eyebrow, marginBottom: '14px' }}>{t.lessonLabel}</div>
      {mod.lesson.map((sec, i) => (
        <div key={i} style={S.lessonCard}>
          <div style={S.lessonHeading}>{L(sec.heading, lang)}</div>
          {L(sec.body, lang).map((p, j) => <p key={j} style={S.lessonPara}>{p}</p>)}
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
      <NameFields lang={lang} />
      <Quiz
        key={mod.id}
        mod={mod}
        lang={lang}
        onComplete={(score, total) => onCompleteQuiz(mod.id, score, total)}
      />
    </div>
  )
}
