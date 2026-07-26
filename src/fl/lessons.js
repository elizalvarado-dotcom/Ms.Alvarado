/* ── Financial Literacy curriculum data (bilingual) ────────────────────────
   Each unit: id, icon, color, title, tagline, and a `modules` array of
   classwork/project items. A unit's `modules` array can be empty — the
   unit still shows up on the home page, its detail page just says
   classwork is coming soon.
   Each module: id, title, tagline, lesson sections, quiz questions.
   `tool` marks modules that render an extra interactive calculator.
------------------------------------------------------------------------- */

export const UNITS = [
  {
    id: 'college-alternatives',
    icon: '🧭',
    color: '#1b7a4d',
    colorDim: 'rgba(27,122,77,0.10)',
    colorBorder: 'rgba(27,122,77,0.30)',
    title: { en: 'Alternatives to 4-Year Colleges', es: 'Alternativas a la Universidad de 4 Años' },
    tagline: {
      en: 'Trade schools, apprenticeships, the military, and other paths after high school.',
      es: 'Escuelas técnicas, aprendizajes, el ejército y otros caminos después de la preparatoria.',
    },
    modules: [],
  },

  {
    id: 'paying-for-college',
    icon: '🎓',
    color: '#a3790a',
    colorDim: 'rgba(163,121,10,0.10)',
    colorBorder: 'rgba(163,121,10,0.30)',
    title: { en: 'Paying For College', es: 'Cómo Pagar la Universidad' },
    tagline: {
      en: 'Scholarships, grants, FAFSA, and student loans — how college really gets paid for.',
      es: 'Becas, subvenciones, FAFSA y préstamos estudiantiles — cómo se paga realmente la universidad.',
    },
    modules: [],
  },

  {
    id: 'banking',
    icon: '🏧',
    color: '#0f6b66',
    colorDim: 'rgba(15,107,102,0.10)',
    colorBorder: 'rgba(15,107,102,0.30)',
    title: { en: 'Banking (Debit & Credit)', es: 'Banca (Débito y Crédito)' },
    tagline: {
      en: 'Checking, savings, debit cards, and how to avoid costly fees.',
      es: 'Cuentas corrientes, de ahorro, tarjetas de débito y cómo evitar tarifas costosas.',
    },
    modules: [
      {
        id: 'banking-basics',
        title: { en: 'Banking Basics', es: 'Fundamentos Bancarios' },
        tagline: {
          en: 'Checking, savings, and how to avoid costly fees.',
          es: 'Cuentas corrientes, de ahorro, y cómo evitar tarifas costosas.',
        },
        lesson: [
          {
            heading: { en: 'Checking vs. savings accounts', es: 'Cuentas corrientes vs. de ahorro' },
            body: {
              en: [
                'A checking account is designed for everyday spending — paying bills, using a debit card, and withdrawing cash. It usually earns little to no interest.',
                'A savings account is designed to hold money you are not spending right away. It typically earns more interest than a checking account, but may limit how often you can withdraw.',
              ],
              es: [
                'Una cuenta corriente está diseñada para gastos diarios — pagar cuentas, usar una tarjeta de débito y retirar efectivo. Generalmente gana poco o nada de interés.',
                'Una cuenta de ahorros está diseñada para guardar dinero que no gastarás de inmediato. Generalmente gana más interés que una cuenta corriente, pero puede limitar cuántas veces puedes retirar.',
              ],
            },
          },
          {
            heading: { en: 'Debit cards vs. credit cards', es: 'Tarjetas de débito vs. tarjetas de crédito' },
            body: {
              en: [
                'A debit card pulls money directly from your checking account — you can only spend money you already have.',
                'A credit card lets you borrow money from the card issuer, which you must pay back — usually with interest if you don\'t pay the full balance by the due date.',
              ],
              es: [
                'Una tarjeta de débito saca dinero directamente de tu cuenta corriente — solo puedes gastar el dinero que ya tienes.',
                'Una tarjeta de crédito te permite pedir dinero prestado del emisor de la tarjeta, que debes devolver — generalmente con interés si no pagas el saldo completo antes de la fecha límite.',
              ],
            },
          },
          {
            heading: { en: 'Avoiding fees', es: 'Cómo evitar tarifas' },
            body: {
              en: [
                'An overdraft happens when you spend more money than you have in your account. Banks may charge an overdraft fee, often $30-$35, for each transaction that overdraws your account.',
                'You can avoid overdraft fees by tracking your balance, setting up low-balance alerts, and linking your checking account to a savings account for backup.',
              ],
              es: [
                'Un sobregiro ocurre cuando gastas más dinero del que tienes en tu cuenta. Los bancos pueden cobrar una tarifa de sobregiro, a menudo de $30-$35, por cada transacción que sobregira tu cuenta.',
                'Puedes evitar tarifas de sobregiro llevando control de tu saldo, configurando alertas de saldo bajo y vinculando tu cuenta corriente a una cuenta de ahorros de respaldo.',
              ],
            },
          },
        ],
        quiz: [
          {
            q: { en: 'Which account type usually earns more interest?', es: '¿Qué tipo de cuenta generalmente gana más interés?' },
            choices: [
              { en: 'Savings account', es: 'Cuenta de ahorros' },
              { en: 'Checking account', es: 'Cuenta corriente' },
              { en: 'Both earn the same', es: 'Ambas ganan lo mismo' },
              { en: 'Neither earns interest', es: 'Ninguna gana interés' },
            ],
            correct: 0,
            explain: { en: 'Savings accounts typically offer higher interest rates than checking accounts, which are built for frequent spending.', es: 'Las cuentas de ahorro generalmente ofrecen tasas de interés más altas que las corrientes.' },
          },
          {
            q: { en: 'What happens when you use a debit card?', es: '¿Qué pasa cuando usas una tarjeta de débito?' },
            choices: [
              { en: 'Money is pulled directly from your checking account', es: 'El dinero se saca directamente de tu cuenta corriente' },
              { en: 'You borrow money from the bank', es: 'Pides dinero prestado al banco' },
              { en: 'You get charged interest immediately', es: 'Te cobran interés de inmediato' },
              { en: 'It works exactly like a credit card', es: 'Funciona exactamente igual que una tarjeta de crédito' },
            ],
            correct: 0,
            explain: { en: 'Debit cards use your own money straight from your checking account — there is no borrowing involved.', es: 'Las tarjetas de débito usan tu propio dinero directamente de tu cuenta corriente.' },
          },
          {
            q: { en: 'An overdraft fee is charged when...', es: 'Se cobra una tarifa de sobregiro cuando...' },
            choices: [
              { en: 'You spend more money than you have in your account', es: 'Gastas más dinero del que tienes en tu cuenta' },
              { en: 'You deposit too much money', es: 'Depositas demasiado dinero' },
              { en: 'You use a savings account', es: 'Usas una cuenta de ahorros' },
              { en: 'You check your balance', es: 'Revisas tu saldo' },
            ],
            correct: 0,
            explain: { en: 'Overdraft fees happen when a transaction pushes your account balance below zero.', es: 'Las tarifas de sobregiro ocurren cuando una transacción deja tu saldo por debajo de cero.' },
          },
          {
            q: { en: 'What is one way to avoid overdraft fees?', es: '¿Cuál es una forma de evitar tarifas de sobregiro?' },
            choices: [
              { en: 'Track your balance and set up low-balance alerts', es: 'Llevar control de tu saldo y configurar alertas de saldo bajo' },
              { en: 'Never look at your account', es: 'Nunca revisar tu cuenta' },
              { en: 'Only use credit cards', es: 'Usar solo tarjetas de crédito' },
              { en: 'Spend as much as possible', es: 'Gastar lo más posible' },
            ],
            correct: 0,
            explain: { en: 'Monitoring your balance and setting alerts helps you avoid accidentally spending more than you have.', es: 'Vigilar tu saldo y configurar alertas te ayuda a evitar gastar accidentalmente más de lo que tienes.' },
          },
          {
            q: { en: 'With a credit card, what happens if you don\'t pay the full balance by the due date?', es: 'Con una tarjeta de crédito, ¿qué pasa si no pagas el saldo completo antes de la fecha límite?' },
            choices: [
              { en: 'You are usually charged interest on the remaining balance', es: 'Generalmente te cobran interés sobre el saldo restante' },
              { en: 'The card is automatically closed', es: 'La tarjeta se cierra automáticamente' },
              { en: 'Nothing happens', es: 'No pasa nada' },
              { en: 'The bank pays the balance for you', es: 'El banco paga el saldo por ti' },
            ],
            correct: 0,
            explain: { en: 'Credit card companies charge interest on any balance not paid in full by the due date — this is how credit card debt grows.', es: 'Las compañías de tarjetas de crédito cobran interés sobre cualquier saldo no pagado en su totalidad — así crece la deuda de tarjeta de crédito.' },
          },
        ],
      },
    ],
  },

  {
    id: 'budgeting',
    icon: '📊',
    color: '#1e3a5f',
    colorDim: 'rgba(30,58,95,0.10)',
    colorBorder: 'rgba(30,58,95,0.30)',
    title: { en: 'Budgeting', es: 'Presupuesto' },
    tagline: {
      en: 'Give every dollar a job before it disappears.',
      es: 'Dale un trabajo a cada dólar antes de que desaparezca.',
    },
    modules: [
      {
        id: 'budgeting-basics',
        title: { en: 'Budgeting Basics', es: 'Fundamentos del Presupuesto' },
        tagline: {
          en: 'Give every dollar a job before it disappears.',
          es: 'Dale un trabajo a cada dólar antes de que desaparezca.',
        },
        tool: 'budget',
        lesson: [
          {
            heading: { en: 'What is a budget?', es: '¿Qué es un presupuesto?' },
            body: {
              en: [
                'A budget is a plan for how you will spend and save your money over a period of time, usually a month. It compares your income (money coming in) to your expenses (money going out).',
                'A budget is not about restriction — it is about control. It helps you decide where your money goes instead of wondering where it went.',
              ],
              es: [
                'Un presupuesto es un plan de cómo gastarás y ahorrarás tu dinero durante un período de tiempo, generalmente un mes. Compara tu ingreso (dinero que entra) con tus gastos (dinero que sale).',
                'Un presupuesto no se trata de restricción — se trata de control. Te ayuda a decidir a dónde va tu dinero en lugar de preguntarte a dónde se fue.',
              ],
            },
          },
          {
            heading: { en: 'Needs vs. wants', es: 'Necesidades vs. deseos' },
            body: {
              en: [
                'Needs are expenses required to live and function: housing, food, transportation, and basic utilities.',
                'Wants are things that make life more enjoyable but are not required: streaming subscriptions, eating out, new clothes, video games. A smart budget covers needs first, then decides how much to spend on wants.',
              ],
              es: [
                'Las necesidades son gastos requeridos para vivir y funcionar: vivienda, comida, transporte y servicios básicos.',
                'Los deseos son cosas que hacen la vida más agradable pero no son necesarias: suscripciones de streaming, comer fuera, ropa nueva, videojuegos. Un presupuesto inteligente cubre las necesidades primero y luego decide cuánto gastar en deseos.',
              ],
            },
          },
          {
            heading: { en: 'The 50/30/20 rule', es: 'La regla 50/30/20' },
            body: {
              en: [
                'A popular guideline for splitting take-home pay is: 50% toward needs, 30% toward wants, and 20% toward savings and paying off debt.',
                'This is just a starting point — you can adjust the percentages based on your own goals and situation, but the idea of planning every dollar stays the same.',
              ],
              es: [
                'Una guía popular para dividir el pago neto es: 50% para necesidades, 30% para deseos y 20% para ahorros y pago de deudas.',
                'Esto es solo un punto de partida — puedes ajustar los porcentajes según tus propias metas y situación, pero la idea de planear cada dólar se mantiene igual.',
              ],
            },
          },
        ],
        quiz: [
          {
            q: { en: 'Which of these is a "need" rather than a "want"?', es: '¿Cuál de estas es una "necesidad" y no un "deseo"?' },
            choices: [
              { en: 'Rent for an apartment', es: 'Renta de un apartamento' },
              { en: 'A streaming subscription', es: 'Una suscripción de streaming' },
              { en: 'The newest video game', es: 'El videojuego más nuevo' },
              { en: 'Concert tickets', es: 'Boletos de concierto' },
            ],
            correct: 0,
            explain: { en: 'Housing is a basic need — it is required for living, unlike entertainment purchases.', es: 'La vivienda es una necesidad básica — se requiere para vivir, a diferencia de las compras de entretenimiento.' },
          },
          {
            q: { en: 'In the 50/30/20 rule, what does the 20% go toward?', es: 'En la regla 50/30/20, ¿para qué es el 20%?' },
            choices: [
              { en: 'Wants', es: 'Deseos' },
              { en: 'Needs', es: 'Necesidades' },
              { en: 'Savings and paying off debt', es: 'Ahorros y pago de deudas' },
              { en: 'Taxes', es: 'Impuestos' },
            ],
            correct: 2,
            explain: { en: 'The 50/30/20 rule allocates 50% to needs, 30% to wants, and 20% to savings/debt payoff.', es: 'La regla 50/30/20 asigna 50% a necesidades, 30% a deseos y 20% a ahorros/pago de deudas.' },
          },
          {
            q: { en: 'A budget compares which two things?', es: '¿Un presupuesto compara cuáles dos cosas?' },
            choices: [
              { en: 'Income and expenses', es: 'Ingreso y gastos' },
              { en: 'Age and grade level', es: 'Edad y nivel escolar' },
              { en: 'Two different banks', es: 'Dos bancos diferentes' },
              { en: 'Gross pay and hourly wage', es: 'Pago bruto y salario por hora' },
            ],
            correct: 0,
            explain: { en: 'A budget compares money coming in (income) to money going out (expenses).', es: 'Un presupuesto compara el dinero que entra (ingreso) con el dinero que sale (gastos).' },
          },
          {
            q: { en: 'If Priya earns $800/month in take-home pay and follows the 50/30/20 rule, how much should go to savings?', es: 'Si Priya gana $800/mes de pago neto y sigue la regla 50/30/20, ¿cuánto debería ir a ahorros?' },
            choices: [
              { en: '$400', es: '$400' },
              { en: '$240', es: '$240' },
              { en: '$160', es: '$160' },
              { en: '$800', es: '$800' },
            ],
            correct: 2,
            explain: { en: '20% of $800 = $160 toward savings/debt.', es: '20% de $800 = $160 para ahorros/deudas.' },
          },
          {
            q: { en: 'Why is budgeting described as giving "every dollar a job"?', es: '¿Por qué se describe el presupuesto como darle "un trabajo a cada dólar"?' },
            choices: [
              { en: 'Because every dollar is planned for a purpose before you spend it', es: 'Porque cada dólar se planea con un propósito antes de gastarlo' },
              { en: 'Because dollars can literally work at a job', es: 'Porque los dólares literalmente pueden trabajar en un empleo' },
              { en: 'Because you must save 100% of your income', es: 'Porque debes ahorrar el 100% de tu ingreso' },
              { en: 'Because budgets are only for adults with jobs', es: 'Porque los presupuestos son solo para adultos con trabajo' },
            ],
            correct: 0,
            explain: { en: 'Intentional budgeting means deciding in advance what each dollar is for, instead of spending randomly.', es: 'El presupuesto intencional significa decidir de antemano para qué es cada dólar, en lugar de gastar al azar.' },
          },
        ],
      },
    ],
  },

  {
    id: 'careers',
    icon: '💼',
    color: '#7a2e3a',
    colorDim: 'rgba(122,46,58,0.10)',
    colorBorder: 'rgba(122,46,58,0.30)',
    title: { en: 'Careers', es: 'Carreras' },
    tagline: {
      en: 'Exploring career paths, job searching, and what it takes to get hired.',
      es: 'Explora carreras, búsqueda de empleo y lo que se necesita para conseguir trabajo.',
    },
    modules: [],
  },
]

/* Find a classwork module by id, along with the unit it belongs to. */
export function findModule(moduleId) {
  for (const unit of UNITS) {
    const mod = unit.modules.find(m => m.id === moduleId)
    if (mod) return { unit, mod }
  }
  return null
}
