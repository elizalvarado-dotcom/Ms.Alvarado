/* ── Shared style tokens for the Financial Literacy site ──────────────────── */
/* Warm "ledger paper" theme: cream + emerald + gold, serif display font.
   Deliberately distinct from the Algebra World site's dark/neon look. */
export const S = {
  page: {
    minHeight: '100vh',
    background: `
      repeating-linear-gradient(
        to bottom,
        rgba(28,43,35,0.035) 0px, rgba(28,43,35,0.035) 1px,
        transparent 1px, transparent 34px
      ),
      #f6f1e6
    `,
    color: '#1c2b23',
    fontFamily: "'Manrope', sans-serif",
    position: 'relative',
    overflowX: 'hidden',
  },
  blob1: { display: 'none' },
  blob2: { display: 'none' },
  blob3: { display: 'none' },

  centerWrap: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', zIndex: 1 },
  card: {
    width: '100%', maxWidth: '440px', background: '#fffdf7', border: '1px solid rgba(28,43,35,0.12)',
    borderRadius: '20px', padding: '44px 38px', boxShadow: '0 18px 44px rgba(28,43,35,0.10)',
    textAlign: 'center',
  },
  logoBox: {
    width: '64px', height: '64px', borderRadius: '16px', margin: '0 auto 18px',
    background: 'linear-gradient(135deg, #1b7a4d, #14532d)',
    border: '1px solid rgba(28,43,35,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1.8rem', boxShadow: '0 8px 20px rgba(20,83,45,0.25)',
  },
  eyebrow: { fontFamily: "'Manrope', sans-serif", fontSize: '.72rem', fontWeight: 800, letterSpacing: '1.8px', textTransform: 'uppercase', color: '#a3790a', marginBottom: '10px' },
  title: { fontFamily: "'Fraunces', serif", fontSize: '1.7rem', fontWeight: 600, lineHeight: 1.25, marginBottom: '10px', color: '#14532d' },
  sub: { fontSize: '.92rem', color: '#5b6b62', lineHeight: 1.55, marginBottom: '24px' },

  fieldWrap: { textAlign: 'left', marginBottom: '16px' },
  label: { display: 'block', fontSize: '.78rem', fontWeight: 700, color: '#5b6b62', marginBottom: '6px', fontFamily: "'Manrope',sans-serif" },
  input: {
    width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(28,43,35,0.18)',
    background: '#fffdf7', color: '#1c2b23', fontSize: '.95rem', fontFamily: "'Manrope',sans-serif",
    outline: 'none', boxSizing: 'border-box', transition: 'border-color .15s',
  },
  select: {
    width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(28,43,35,0.18)',
    background: '#fffdf7', color: '#1c2b23', fontSize: '.95rem', fontFamily: "'Manrope',sans-serif",
    outline: 'none', boxSizing: 'border-box', cursor: 'pointer',
  },
  errText: { color: '#7a2e3a', fontSize: '.82rem', marginBottom: '14px', fontWeight: 700 },

  primaryBtn: {
    width: '100%', padding: '13px', borderRadius: '10px', border: 'none', cursor: 'pointer',
    background: 'linear-gradient(135deg,#1b7a4d,#14532d)', color: '#fdf8ec', fontWeight: 800,
    fontSize: '.95rem', fontFamily: "'Manrope',sans-serif", marginTop: '6px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    boxShadow: '0 8px 20px rgba(20,83,45,0.22)',
  },
  googleBtn: {
    width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(28,43,35,0.18)', cursor: 'pointer',
    background: '#fffdf7', color: '#1c2b23', fontWeight: 700, fontSize: '.9rem',
    fontFamily: "'Manrope',sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
  },
  linkBtn: { background: 'none', border: 'none', color: '#5b6b62', fontSize: '.82rem', cursor: 'pointer', marginTop: '18px', textDecoration: 'underline', fontFamily: "'Manrope',sans-serif" },

  langToggle: { display: 'flex', gap: '4px', background: 'rgba(28,43,35,0.05)', border: '1px solid rgba(28,43,35,0.14)', borderRadius: '18px', padding: '3px' },
  langBtn: { padding: '5px 12px', borderRadius: '14px', border: 'none', background: 'transparent', color: '#5b6b62', fontWeight: 800, fontSize: '.7rem', cursor: 'pointer', fontFamily: "'Manrope',sans-serif", letterSpacing: '.5px' },
  langBtnActive: { background: '#1b7a4d', color: '#fdf8ec' },

  header: {
    position: 'sticky', top: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '14px 28px', background: 'rgba(246,241,230,0.92)', borderBottom: '1px solid rgba(28,43,35,0.12)',
    flexWrap: 'wrap', gap: '12px',
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '10px' },
  headerLogo: { width: '36px', height: '36px', borderRadius: '9px', background: 'linear-gradient(135deg, #1b7a4d, #14532d)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.05rem', boxShadow: '0 4px 10px rgba(20,83,45,0.25)' },
  headerName: { fontFamily: "'Fraunces',serif", fontWeight: 600, fontSize: '1.1rem', color: '#14532d' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' },
  navBtn: { padding: '7px 14px', borderRadius: '18px', border: '1px solid rgba(28,43,35,0.16)', background: '#fffdf7', color: '#5b6b62', fontWeight: 700, fontSize: '.78rem', cursor: 'pointer', fontFamily: "'Manrope',sans-serif" },
  badge: { padding: '6px 14px', borderRadius: '18px', background: 'rgba(27,122,77,0.10)', border: '1px solid rgba(27,122,77,0.3)', color: '#14532d', fontWeight: 700, fontSize: '.78rem', fontFamily: "'Manrope',sans-serif", whiteSpace: 'nowrap' },

  pageInner: { maxWidth: '1080px', margin: '0 auto', padding: '40px 24px 80px', position: 'relative', zIndex: 1 },
  greetEyebrow: { fontFamily: "'Manrope',sans-serif", fontSize: '.72rem', fontWeight: 800, letterSpacing: '1.8px', textTransform: 'uppercase', color: '#a3790a', marginBottom: '8px' },
  greetName: { fontFamily: "'Fraunces',serif", fontSize: '2.1rem', fontWeight: 600, marginBottom: '10px', color: '#14532d' },
  greetSub: { color: '#5b6b62', fontSize: '.96rem', marginBottom: '32px' },

  moduleGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '20px' },
  moduleCard: {
    textAlign: 'left', borderRadius: '18px', padding: '26px', border: '1px solid rgba(28,43,35,0.12)',
    background: '#fffdf7', cursor: 'pointer', transition: 'transform .2s, box-shadow .2s, border-color .2s',
    display: 'flex', flexDirection: 'column', gap: '14px', boxShadow: '0 2px 10px rgba(28,43,35,0.05)',
  },
  moduleIcon: { width: '52px', height: '52px', borderRadius: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' },
  moduleTitle: { fontFamily: "'Fraunces',serif", fontSize: '1.2rem', fontWeight: 600 },
  moduleTagline: { color: '#5b6b62', fontSize: '.85rem', lineHeight: 1.5 },
  moduleFooter: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '14px', borderTop: '1px solid rgba(28,43,35,0.10)', fontSize: '.78rem', color: '#8a8f78' },

  backLink: { background: 'none', border: 'none', color: '#5b6b62', fontSize: '.85rem', cursor: 'pointer', marginBottom: '20px', fontFamily: "'Manrope',sans-serif", fontWeight: 700, padding: 0 },

  lessonCard: { background: '#fffdf7', border: '1px solid rgba(28,43,35,0.12)', borderRadius: '18px', padding: '28px', marginBottom: '20px', boxShadow: '0 2px 10px rgba(28,43,35,0.04)' },
  lessonHeading: { fontFamily: "'Fraunces',serif", fontSize: '1.15rem', fontWeight: 600, marginBottom: '10px', color: '#14532d' },
  lessonPara: { color: '#3c4a41', fontSize: '.94rem', lineHeight: 1.7, marginBottom: '10px' },

  quizCard: { background: '#fffdf7', border: '1px solid rgba(28,43,35,0.12)', borderRadius: '18px', padding: '28px', boxShadow: '0 2px 10px rgba(28,43,35,0.04)' },
  choiceBtn: {
    width: '100%', textAlign: 'left', padding: '13px 16px', borderRadius: '12px', border: '1px solid rgba(28,43,35,0.15)',
    background: '#fbf8f0', color: '#1c2b23', fontSize: '.9rem', cursor: 'pointer', marginBottom: '10px',
    fontFamily: "'Manrope',sans-serif", transition: 'border-color .15s, background .15s',
  },
  choiceCorrect: { border: '1px solid rgba(27,122,77,0.5)', background: 'rgba(27,122,77,0.12)' },
  choiceWrong: { border: '1px solid rgba(122,46,58,0.4)', background: 'rgba(122,46,58,0.10)' },

  toolCard: { background: '#fffdf7', border: '1px solid rgba(28,43,35,0.12)', borderRadius: '18px', padding: '28px', marginBottom: '20px', boxShadow: '0 2px 10px rgba(28,43,35,0.04)' },

  table: { width: '100%', borderCollapse: 'collapse', fontSize: '.85rem' },
  th: { textAlign: 'left', padding: '10px 12px', color: '#5b6b62', fontWeight: 700, fontSize: '.72rem', textTransform: 'uppercase', letterSpacing: '.5px', borderBottom: '1px solid rgba(28,43,35,0.12)' },
  td: { padding: '10px 12px', borderBottom: '1px solid rgba(28,43,35,0.08)' },
}
