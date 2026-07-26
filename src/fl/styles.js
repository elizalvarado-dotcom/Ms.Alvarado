/* ── Shared style tokens for the Financial Literacy site ──────────────────── */
export const S = {
  page: {
    minHeight: '100vh',
    background: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.018) 1px, transparent 0) 0 0 / 32px 32px, #080d1c',
    color: '#ede9f4',
    fontFamily: "'Inter', sans-serif",
    position: 'relative',
    overflowX: 'hidden',
  },
  blob1: { position: 'fixed', top: '-10%', left: '-10%', width: '480px', height: '480px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(52,211,153,0.16), transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' },
  blob2: { position: 'fixed', bottom: '-15%', right: '-10%', width: '520px', height: '520px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,168,50,0.14), transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' },
  blob3: { position: 'fixed', top: '35%', right: '20%', width: '360px', height: '360px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,195,247,0.10), transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' },

  centerWrap: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', zIndex: 1 },
  card: {
    width: '100%', maxWidth: '440px', background: 'rgba(14,21,40,0.82)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '24px', padding: '40px 36px', backdropFilter: 'blur(16px)', boxShadow: '0 24px 64px rgba(0,0,0,.5)',
    textAlign: 'center',
  },
  logoBox: {
    width: '64px', height: '64px', borderRadius: '18px', margin: '0 auto 18px',
    background: 'linear-gradient(135deg, rgba(52,211,153,0.18), rgba(232,168,50,0.18))',
    border: '1px solid rgba(52,211,153,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1.8rem',
  },
  eyebrow: { fontFamily: "'JetBrains Mono', monospace", fontSize: '.7rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#34d399', marginBottom: '10px' },
  title: { fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.6rem', fontWeight: 800, lineHeight: 1.25, marginBottom: '10px' },
  sub: { fontSize: '.9rem', color: '#8a96b8', lineHeight: 1.5, marginBottom: '24px' },

  fieldWrap: { textAlign: 'left', marginBottom: '16px' },
  label: { display: 'block', fontSize: '.78rem', fontWeight: 700, color: '#8a96b8', marginBottom: '6px', fontFamily: "'Inter',sans-serif" },
  input: {
    width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.04)', color: '#ede9f4', fontSize: '.95rem', fontFamily: "'Inter',sans-serif",
    outline: 'none', boxSizing: 'border-box', transition: 'border-color .15s',
  },
  select: {
    width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.04)', color: '#ede9f4', fontSize: '.95rem', fontFamily: "'Inter',sans-serif",
    outline: 'none', boxSizing: 'border-box', cursor: 'pointer',
  },
  errText: { color: '#f87171', fontSize: '.82rem', marginBottom: '14px', fontWeight: 600 },

  primaryBtn: {
    width: '100%', padding: '13px', borderRadius: '12px', border: 'none', cursor: 'pointer',
    background: 'linear-gradient(135deg,#34d399,#22b884)', color: '#04150f', fontWeight: 800,
    fontSize: '.95rem', fontFamily: "'Inter',sans-serif", marginTop: '6px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
  },
  googleBtn: {
    width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer',
    background: 'rgba(255,255,255,0.05)', color: '#ede9f4', fontWeight: 700, fontSize: '.9rem',
    fontFamily: "'Inter',sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
  },
  linkBtn: { background: 'none', border: 'none', color: '#6b7a9a', fontSize: '.82rem', cursor: 'pointer', marginTop: '18px', textDecoration: 'underline', fontFamily: "'Inter',sans-serif" },

  langToggle: { display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '3px' },
  langBtn: { padding: '5px 12px', borderRadius: '16px', border: 'none', background: 'transparent', color: '#6b7a9a', fontWeight: 700, fontSize: '.72rem', cursor: 'pointer', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '.5px' },
  langBtnActive: { background: 'rgba(52,211,153,0.18)', color: '#34d399' },

  header: {
    position: 'sticky', top: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '14px 28px', background: 'rgba(8,13,28,0.85)', backdropFilter: 'blur(14px)', borderBottom: '1px solid rgba(255,255,255,0.06)',
    flexWrap: 'wrap', gap: '12px',
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '10px' },
  headerLogo: { width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, rgba(52,211,153,0.2), rgba(232,168,50,0.2))', border: '1px solid rgba(52,211,153,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' },
  headerName: { fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: '1.05rem' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' },
  navBtn: { padding: '7px 14px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', color: '#8a96b8', fontWeight: 700, fontSize: '.78rem', cursor: 'pointer', fontFamily: "'Inter',sans-serif" },
  badge: { padding: '6px 14px', borderRadius: '20px', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.28)', color: '#34d399', fontWeight: 700, fontSize: '.78rem', fontFamily: "'Inter',sans-serif", whiteSpace: 'nowrap' },

  pageInner: { maxWidth: '1080px', margin: '0 auto', padding: '40px 24px 80px', position: 'relative', zIndex: 1 },
  greetEyebrow: { fontFamily: "'JetBrains Mono',monospace", fontSize: '.7rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#34d399', marginBottom: '8px' },
  greetName: { fontFamily: "'Space Grotesk',sans-serif", fontSize: '2rem', fontWeight: 800, marginBottom: '10px' },
  greetSub: { color: '#8a96b8', fontSize: '.95rem', marginBottom: '32px' },

  moduleGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '20px' },
  moduleCard: {
    textAlign: 'left', borderRadius: '20px', padding: '26px', border: '1px solid rgba(255,255,255,0.07)',
    background: 'rgba(14,21,40,0.7)', cursor: 'pointer', transition: 'transform .2s, box-shadow .2s, border-color .2s',
    display: 'flex', flexDirection: 'column', gap: '14px',
  },
  moduleIcon: { width: '52px', height: '52px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' },
  moduleTitle: { fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.15rem', fontWeight: 800 },
  moduleTagline: { color: '#8a96b8', fontSize: '.85rem', lineHeight: 1.45 },
  moduleFooter: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '.78rem', color: '#6b7a9a' },

  backLink: { background: 'none', border: 'none', color: '#8a96b8', fontSize: '.85rem', cursor: 'pointer', marginBottom: '20px', fontFamily: "'Inter',sans-serif", fontWeight: 600, padding: 0 },

  lessonCard: { background: 'rgba(14,21,40,0.7)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '28px', marginBottom: '20px' },
  lessonHeading: { fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.1rem', fontWeight: 800, marginBottom: '10px' },
  lessonPara: { color: '#c3cadd', fontSize: '.92rem', lineHeight: 1.65, marginBottom: '10px' },

  quizCard: { background: 'rgba(14,21,40,0.7)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '28px' },
  choiceBtn: {
    width: '100%', textAlign: 'left', padding: '13px 16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.03)', color: '#ede9f4', fontSize: '.9rem', cursor: 'pointer', marginBottom: '10px',
    fontFamily: "'Inter',sans-serif", transition: 'border-color .15s, background .15s',
  },
  choiceCorrect: { borderColor: 'rgba(52,211,153,0.5)', background: 'rgba(52,211,153,0.12)' },
  choiceWrong: { borderColor: 'rgba(248,113,113,0.5)', background: 'rgba(248,113,113,0.12)' },

  toolCard: { background: 'rgba(14,21,40,0.7)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '28px', marginBottom: '20px' },

  table: { width: '100%', borderCollapse: 'collapse', fontSize: '.85rem' },
  th: { textAlign: 'left', padding: '10px 12px', color: '#8a96b8', fontWeight: 700, fontSize: '.72rem', textTransform: 'uppercase', letterSpacing: '.5px', borderBottom: '1px solid rgba(255,255,255,0.08)' },
  td: { padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.05)' },
}
