import { S } from './styles.js'

export default function LangToggle({ lang, setLang }) {
  return (
    <div style={S.langToggle}>
      {['en', 'es'].map(l => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          style={{ ...S.langBtn, ...(lang === l ? S.langBtnActive : {}) }}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
