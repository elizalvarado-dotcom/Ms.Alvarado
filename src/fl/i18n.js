/* ── Bilingual UI strings for the Financial Literacy site ─────────────────── */
export const T = {
  en: {
    siteName: 'Money Matters',
    siteTag: '9th Grade Financial Literacy',
    backToAlgebra: 'Algebra World →',

    // Name fields (shown at the top of each module's quiz)
    nameFieldsTitle: 'Write your name and period before you begin',
    firstNameLabel: 'First Name',
    firstNamePh: 'e.g. Jordan',
    lastNameLabel: 'Last Name',
    lastNamePh: 'e.g. Rivera',
    periodLabel: 'Class Period',
    periodPh: 'e.g. 3',

    teacherLoginLink: 'Teacher login',

    // Teacher login
    teacherLoginTitle: 'Teacher Answer Key',
    teacherLoginSub: 'Sign in with your school Google account to view the answer key for every module.',
    signInGoogle: 'Sign in with Google',
    signingIn: 'Signing in…',
    accessDenied: 'Access denied. This page is restricted to the class teacher.',
    signInFailed: 'Sign-in failed. Please try again.',
    popupBlocked: 'Popup blocked. Please allow popups for this site and try again.',

    // Nav / header
    signOut: 'Sign out',
    dashboard: 'Teacher Answer Key',

    // Home page (units)
    greeting: 'Welcome',
    greetingSub: 'Pick a unit below to see its classwork and project modules.',
    periodBadge: p => `Period ${p}`,
    exploreUnit: 'Explore Unit',
    classworkCount: n => `${n} classwork module${n === 1 ? '' : 's'}`,
    comingSoonBadge: 'Coming Soon',

    // Unit detail page
    backToUnits: '← Back to Units',
    comingSoonTitle: 'Coming Soon',
    comingSoonSub: "Classwork and projects for this unit haven't been added yet — check back soon!",
    startModule: 'Start Module',
    reviewModule: 'Review Module',
    completedBadge: '✅ Completed',
    scoreOf: (s, t) => `Score: ${s}/${t}`,
    questionsCount: n => `${n} questions`,

    // Module / quiz
    backToModules: '← Back to Unit',
    lessonLabel: 'Lesson',
    quizLabel: 'Check Your Understanding',
    question: 'Question',
    checkAnswer: 'Check Answer',
    nextQuestion: 'Next Question',
    finishModule: 'Finish Module',
    correct: '✅ Correct!',
    incorrect: '❌ Not quite.',
    tryTool: 'Try It Yourself',
    quizComplete: 'Quiz Complete!',
    quizCompleteSub: (s, t) => `You scored ${s} out of ${t}. Great work!`,
    retakeQuiz: 'Retake Quiz',

    // Budget tool
    budgetToolTitle: '💰 Build Your Own Budget',
    budgetToolSub: 'Enter a monthly income and decide how much to put toward each category. Try to spend every dollar on purpose!',
    monthlyIncome: 'Monthly Income',
    category_housing: 'Housing',
    category_food: 'Food',
    category_transportation: 'Transportation',
    category_savings: 'Savings',
    category_fun: 'Fun & Extras',
    category_other: 'Other',
    totalAllocated: 'Total Allocated',
    remaining: 'Remaining',
    overBudget: '⚠️ You allocated more than your income!',
    perfectBudget: '🎉 Every dollar has a job — nice budgeting!',

    // Interest tool
    interestToolTitle: '📈 Compound Interest Calculator',
    interestToolSub: 'See how your savings can grow over time with compound interest.',
    principal: 'Starting Amount ($)',
    rate: 'Annual Interest Rate (%)',
    years: 'Number of Years',
    compoundsPerYear: 'Compounds per Year',
    futureValue: 'Future Value',
    totalInterestEarned: 'Total Interest Earned',

    // Teacher answer key
    dashTitle: 'Answer Key — Money Matters',
    dashSub: 'Every classwork module\'s quiz questions, grouped by unit, with the correct answer highlighted and an explanation.',
    noClassworkYet: 'No classwork added to this unit yet.',
  },
  es: {
    siteName: 'Cuestión de Dinero',
    siteTag: 'Educación Financiera · 9º Grado',
    backToAlgebra: 'Mundo del Álgebra →',

    nameFieldsTitle: 'Escribe tu nombre y período antes de comenzar',
    firstNameLabel: 'Nombre',
    firstNamePh: 'ej. Jordan',
    lastNameLabel: 'Apellido',
    lastNamePh: 'ej. Rivera',
    periodLabel: 'Período de Clase',
    periodPh: 'ej. 3',

    teacherLoginLink: 'Inicio de sesión de maestra',

    teacherLoginTitle: 'Clave de Respuestas de la Maestra',
    teacherLoginSub: 'Inicia sesión con tu cuenta de Google escolar para ver la clave de respuestas de todos los módulos.',
    signInGoogle: 'Iniciar sesión con Google',
    signingIn: 'Iniciando sesión…',
    accessDenied: 'Acceso denegado. Esta página está restringida a la maestra de la clase.',
    signInFailed: 'Error al iniciar sesión. Intenta de nuevo.',
    popupBlocked: 'Ventana emergente bloqueada. Permite ventanas emergentes e intenta de nuevo.',

    signOut: 'Cerrar sesión',
    dashboard: 'Clave de Respuestas',

    greeting: 'Bienvenido',
    greetingSub: 'Elige una unidad abajo para ver sus tareas y proyectos.',
    periodBadge: p => `Período ${p}`,
    exploreUnit: 'Explorar Unidad',
    classworkCount: n => `${n} módulo${n === 1 ? '' : 's'} de tarea`,
    comingSoonBadge: 'Próximamente',

    backToUnits: '← Volver a Unidades',
    comingSoonTitle: 'Próximamente',
    comingSoonSub: 'Las tareas y proyectos de esta unidad todavía no se han agregado — ¡vuelve pronto!',
    startModule: 'Comenzar Módulo',
    reviewModule: 'Repasar Módulo',
    completedBadge: '✅ Completado',
    scoreOf: (s, t) => `Puntaje: ${s}/${t}`,
    questionsCount: n => `${n} preguntas`,

    backToModules: '← Volver a la Unidad',
    lessonLabel: 'Lección',
    quizLabel: 'Comprueba tu Comprensión',
    question: 'Pregunta',
    checkAnswer: 'Comprobar Respuesta',
    nextQuestion: 'Siguiente Pregunta',
    finishModule: 'Terminar Módulo',
    correct: '✅ ¡Correcto!',
    incorrect: '❌ No es correcto.',
    tryTool: 'Pruébalo Tú Mismo',
    quizComplete: '¡Cuestionario Completo!',
    quizCompleteSub: (s, t) => `Obtuviste ${s} de ${t}. ¡Buen trabajo!`,
    retakeQuiz: 'Repetir Cuestionario',

    budgetToolTitle: '💰 Crea Tu Propio Presupuesto',
    budgetToolSub: 'Ingresa un ingreso mensual y decide cuánto destinar a cada categoría. ¡Intenta darle un propósito a cada dólar!',
    monthlyIncome: 'Ingreso Mensual',
    category_housing: 'Vivienda',
    category_food: 'Comida',
    category_transportation: 'Transporte',
    category_savings: 'Ahorros',
    category_fun: 'Diversión y Extras',
    category_other: 'Otro',
    totalAllocated: 'Total Asignado',
    remaining: 'Restante',
    overBudget: '⚠️ ¡Asignaste más de tu ingreso!',
    perfectBudget: '🎉 Cada dólar tiene un propósito — ¡buen presupuesto!',

    interestToolTitle: '📈 Calculadora de Interés Compuesto',
    interestToolSub: 'Observa cómo tus ahorros pueden crecer con el tiempo gracias al interés compuesto.',
    principal: 'Cantidad Inicial ($)',
    rate: 'Tasa de Interés Anual (%)',
    years: 'Número de Años',
    compoundsPerYear: 'Capitalizaciones por Año',
    futureValue: 'Valor Futuro',
    totalInterestEarned: 'Interés Total Ganado',

    dashTitle: 'Clave de Respuestas — Cuestión de Dinero',
    dashSub: 'Las preguntas de cada módulo de tarea, agrupadas por unidad, con la respuesta correcta resaltada y una explicación.',
    noClassworkYet: 'Todavía no se ha agregado tarea a esta unidad.',
  },
}

/* Resolve a bilingual { en, es } value, or pass through plain strings */
export const L = (val, lang) => (val && typeof val === 'object' && ('en' in val || 'es' in val)) ? (val[lang] ?? val.en) : (val ?? '')

export const TEACHER_EMAIL = 'elizalvarado@paps.net'
