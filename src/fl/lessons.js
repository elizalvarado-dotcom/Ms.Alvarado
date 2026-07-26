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
    modules: [
      {
        id: 'college-alt-basics',
        title: { en: 'Life After High School: Is College Required?', es: 'La Vida Después de la Preparatoria: ¿Es Necesaria la Universidad?' },
        tagline: {
          en: 'Weigh the real cost of a 4-year degree against trade school, apprenticeships, the military, and working right away.',
          es: 'Compara el costo real de un título de 4 años con la escuela técnica, aprendizajes, el ejército y comenzar a trabajar de inmediato.',
        },
        lesson: [
          {
            heading: { en: 'Does your career actually require a 4-year degree?', es: '¿Tu carrera realmente requiere un título de 4 años?' },
            body: {
              en: [
                'The path to a career after high school looks different for everyone. A four-year college degree is one option — but it is not the only one, and it is not required for every job.',
                'Some careers (like nursing, teaching, or engineering) legally require a specific degree or license. Many others — including many well-paying skilled trades and tech jobs — do not.',
                'Before deciding on a path, the first question to ask is simple: does the career I want actually require a four-year degree?',
              ],
              es: [
                'El camino hacia una carrera después de la preparatoria se ve diferente para cada persona. Un título universitario de cuatro años es una opción — pero no es la única, y no se requiere para todos los trabajos.',
                'Algunas carreras (como enfermería, docencia o ingeniería) requieren legalmente un título o licencia específica. Muchas otras — incluyendo varios oficios calificados y empleos de tecnología bien pagados — no lo requieren.',
                'Antes de decidir un camino, la primera pregunta que hay que hacerse es simple: ¿la carrera que quiero realmente requiere un título de cuatro años?',
              ],
            },
            resources: [
              { label: { en: '🎥 Watch: Decrease in Four-Year Degrees', es: '🎥 Ver: Disminución de Títulos de Cuatro Años' }, url: 'https://www.youtube.com/watch?v=sp6dNckhhD0' },
            ],
          },
          {
            heading: { en: 'Weighing the real cost of college', es: 'Cómo sopesar el costo real de la universidad' },
            body: {
              en: [
                'College tuition has risen a lot over the past few decades. Today a four-year degree can cost tens of thousands of dollars a year at many public and private universities once you include tuition, fees, and living expenses.',
                'That cost usually means years of saving beforehand, or student loan debt that has to be paid back — often for years after graduation.',
                'This doesn\'t mean college is a bad choice — for many careers it pays off. It just means the cost is a real factor to weigh honestly against your other options, not something to ignore.',
              ],
              es: [
                'La matrícula universitaria ha subido mucho en las últimas décadas. Hoy un título de cuatro años puede costar decenas de miles de dólares al año en muchas universidades públicas y privadas, considerando matrícula, cuotas y gastos de vivienda.',
                'Ese costo generalmente significa años de ahorro previo, o una deuda de préstamos estudiantiles que hay que pagar — muchas veces durante años después de graduarse.',
                'Esto no significa que la universidad sea una mala decisión — para muchas carreras vale la pena. Solo significa que el costo es un factor real que hay que sopesar honestamente frente a tus otras opciones, no algo que se debe ignorar.',
              ],
            },
            resources: [
              { label: { en: '🎥 Watch: Do You Really Need a College Degree?', es: '🎥 Ver: ¿Realmente Necesitas un Título Universitario?' }, url: 'https://www.youtube.com/watch?v=YX9NWYz3Gzk' },
            ],
          },
          {
            heading: { en: 'Alternative paths after high school', es: 'Caminos alternativos después de la preparatoria' },
            body: {
              en: [
                'Apprenticeships combine paid, on-the-job training with related classroom instruction — usually over one to four years — and often lead directly to a certification in a skilled trade like electrical work, plumbing, or HVAC.',
                'Internships are usually shorter (a summer or semester), may or may not be paid, and are meant to give exposure to a field rather than a full occupational credential.',
                'Trade and technical schools, military enlistment, and going straight to work are other common paths — each trading a four-year degree for faster, often lower-cost entry into the workforce.',
              ],
              es: [
                'Los aprendizajes combinan capacitación pagada en el trabajo con instrucción relacionada en el aula — generalmente durante uno a cuatro años — y a menudo llevan directamente a una certificación en un oficio calificado como electricidad, plomería o climatización.',
                'Las pasantías suelen ser más cortas (un verano o un semestre), pueden ser pagadas o no, y están pensadas para dar exposición a un campo en lugar de una credencial ocupacional completa.',
                'Las escuelas técnicas, el alistamiento militar y comenzar a trabajar de inmediato son otros caminos comunes — cada uno cambia un título de cuatro años por una entrada más rápida y a menudo más económica al mundo laboral.',
              ],
            },
            resources: [
              { label: { en: '📄 Read: Alternatives To College After High School', es: '📄 Leer: Alternativas a la Universidad Después de la Preparatoria' }, url: 'https://www.asvabprogram.com/media-center-article/61' },
            ],
          },
          {
            heading: { en: 'How to decide what\'s right for you', es: 'Cómo decidir qué es lo correcto para ti' },
            body: {
              en: [
                'There is no single right answer — the best path depends on the career you want, how you learn best, your finances, and how ready you are to decide right now.',
                'A few questions worth asking yourself: Does my goal require a specific degree? Can I afford the cost (or debt) of college? Would I rather learn by doing, or in a classroom? Is there a faster path that still gets me where I want to go?',
                'Choosing an apprenticeship, trade school, the military, or going straight to work is not "settling" — for a lot of careers, it\'s simply the smarter, faster route.',
              ],
              es: [
                'No hay una única respuesta correcta — el mejor camino depende de la carrera que quieras, de cómo aprendes mejor, de tus finanzas y de qué tan listo estás para decidir ahora mismo.',
                'Algunas preguntas que vale la pena hacerte: ¿Mi meta requiere un título específico? ¿Puedo pagar el costo (o la deuda) de la universidad? ¿Prefiero aprender haciendo, o en un salón de clases? ¿Hay un camino más rápido que igual me lleve a donde quiero llegar?',
                'Elegir un aprendizaje, una escuela técnica, el ejército o comenzar a trabajar de inmediato no es "conformarse" — para muchas carreras, es simplemente la ruta más inteligente y rápida.',
              ],
            },
            resources: [
              { label: { en: '📄 Read: College Degree vs. No College Degree', es: '📄 Leer: Título Universitario vs. Sin Título Universitario' }, url: 'https://www.indeed.com/career-advice/finding-a-job/college-degree-vs-no-college-degree' },
            ],
          },
        ],
        quiz: [
          {
            q: { en: 'Which of the following is NOT typically required to start a skilled-trade apprenticeship?', es: '¿Cuál de las siguientes NO se requiere típicamente para comenzar un aprendizaje en un oficio calificado?' },
            choices: [
              { en: 'A four-year college degree', es: 'Un título universitario de cuatro años' },
              { en: 'Paid on-the-job training', es: 'Capacitación pagada en el trabajo' },
              { en: 'Related classroom instruction', es: 'Instrucción relacionada en el aula' },
              { en: 'A structured multi-year program', es: 'Un programa estructurado de varios años' },
            ],
            correct: 0,
            explain: { en: 'Apprenticeships are designed as an alternative to a four-year degree — they combine paid work experience with related instruction instead.', es: 'Los aprendizajes están diseñados como una alternativa a un título de cuatro años — combinan experiencia laboral pagada con instrucción relacionada en su lugar.' },
          },
          {
            q: { en: 'What is a key difference between an apprenticeship and an internship?', es: '¿Cuál es una diferencia clave entre un aprendizaje y una pasantía?' },
            choices: [
              { en: 'Apprenticeships combine paid work with related instruction over a longer period; internships are usually shorter and mainly for exposure to a field', es: 'Los aprendizajes combinan trabajo pagado con instrucción relacionada durante un período más largo; las pasantías suelen ser más cortas y principalmente para exponerte a un campo' },
              { en: 'Internships always pay more than apprenticeships', es: 'Las pasantías siempre pagan más que los aprendizajes' },
              { en: 'Apprenticeships never include any classroom instruction', es: 'Los aprendizajes nunca incluyen instrucción en el aula' },
              { en: 'There is no real difference between them', es: 'No hay una diferencia real entre ellos' },
            ],
            correct: 0,
            explain: { en: 'Apprenticeships are longer, paid, and combine work with related instruction toward a credential; internships are shorter-term exposure to a field.', es: 'Los aprendizajes son más largos, pagados, y combinan trabajo con instrucción relacionada hacia una credencial; las pasantías son una exposición más corta a un campo.' },
          },
          {
            q: { en: 'Which of these is generally an advantage of starting work right after high school instead of college?', es: '¿Cuál de estas es generalmente una ventaja de comenzar a trabajar justo después de la preparatoria en lugar de la universidad?' },
            choices: [
              { en: 'You start earning income and gaining experience immediately, without taking on student debt', es: 'Comienzas a ganar ingresos y adquirir experiencia de inmediato, sin adquirir deuda estudiantil' },
              { en: 'It guarantees a higher salary than college in every career', es: 'Garantiza un salario más alto que la universidad en cualquier carrera' },
              { en: 'Every career legally requires this path', es: 'Toda carrera requiere legalmente este camino' },
              { en: 'You can never attend college later', es: 'Nunca podrás asistir a la universidad después' },
            ],
            correct: 0,
            explain: { en: 'Working right away means immediate income and real-world experience with no student debt — though it isn\'t a guarantee of higher pay, and college later is still possible.', es: 'Trabajar de inmediato significa ingresos inmediatos y experiencia real sin deuda estudiantil — aunque no garantiza un salario más alto, y todavía es posible ir a la universidad después.' },
          },
          {
            q: { en: 'Which career is most likely to legally require a specific college degree?', es: '¿Qué carrera probablemente requiera legalmente un título universitario específico?' },
            choices: [
              { en: 'Registered nurse', es: 'Enfermera/o registrada/o' },
              { en: 'Electrician', es: 'Electricista' },
              { en: 'Web developer', es: 'Desarrollador(a) web' },
              { en: 'Small business owner', es: 'Dueño(a) de un pequeño negocio' },
            ],
            correct: 0,
            explain: { en: 'Nursing requires a specific accredited degree and license. Electricians typically train through apprenticeships, and many web developers and business owners never need a specific degree.', es: 'La enfermería requiere un título acreditado específico y una licencia. Los electricistas generalmente se capacitan mediante aprendizajes, y muchos desarrolladores web y dueños de negocios nunca necesitan un título específico.' },
          },
          {
            q: { en: 'Yuna wants to start working right after high school, save money, and possibly go to college later if a job ever requires it. What should she weigh most carefully before deciding?', es: 'Yuna quiere empezar a trabajar justo después de la preparatoria, ahorrar dinero y tal vez ir a la universidad después si algún trabajo lo requiere. ¿Qué debería considerar con más cuidado antes de decidir?' },
            choices: [
              { en: 'Whether her actual career goals ever require a specific degree or license', es: 'Si sus metas profesionales reales alguna vez requieren un título o licencia específica' },
              { en: 'Whether most of her friends are going to college', es: 'Si la mayoría de sus amigos van a la universidad' },
              { en: 'What her favorite subject in school is', es: 'Cuál es su materia favorita en la escuela' },
              { en: 'Whether college exists as an option', es: 'Si la universidad existe como opción' },
            ],
            correct: 0,
            explain: { en: 'The most important factor is whether the career she actually wants requires a specific credential — not what peers are doing or unrelated preferences.', es: 'El factor más importante es si la carrera que realmente quiere requiere una credencial específica — no lo que hacen sus compañeros ni preferencias sin relación.' },
          },
        ],
      },
    ],
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
