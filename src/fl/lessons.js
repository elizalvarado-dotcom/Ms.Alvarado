/* ── Financial Literacy curriculum data (bilingual) ────────────────────────
   Each module: id, icon, color, title, tagline, lesson sections, quiz questions.
   `tool` marks modules that render an extra interactive calculator.
------------------------------------------------------------------------- */

export const MODULES = [
  {
    id: 'income',
    icon: '💵',
    color: '#1b7a4d',
    colorDim: 'rgba(27,122,77,0.10)',
    colorBorder: 'rgba(27,122,77,0.30)',
    title: { en: 'Income & Paychecks', es: 'Ingresos y Cheques de Pago' },
    tagline: {
      en: 'Where your money comes from, and why your paycheck is smaller than you think.',
      es: 'De dónde viene tu dinero y por qué tu cheque es más pequeño de lo que piensas.',
    },
    lesson: [
      {
        heading: { en: 'What is income?', es: '¿Qué es el ingreso?' },
        body: {
          en: [
            'Income is money you receive, usually in exchange for work. Most teens earn income from a part-time job, but income can also come from allowances, gifts, tips, or investments.',
            'As an adult, your main source of income will likely be your job — paid hourly (an hourly wage) or with a fixed yearly amount (a salary).',
          ],
          es: [
            'El ingreso es el dinero que recibes, generalmente a cambio de trabajo. La mayoría de los adolescentes ganan ingresos de un trabajo de medio tiempo, pero el ingreso también puede venir de mesadas, regalos, propinas o inversiones.',
            'De adulto, tu principal fuente de ingreso probablemente será tu trabajo — pagado por hora (salario por hora) o con una cantidad fija anual (salario).',
          ],
        },
      },
      {
        heading: { en: 'Gross pay vs. net pay', es: 'Pago bruto vs. pago neto' },
        body: {
          en: [
            'Gross pay is the total amount you earn before anything is subtracted — for example, working 20 hours at $15/hour gives you $300 in gross pay.',
            'Net pay (also called "take-home pay") is what actually lands in your bank account after taxes and other deductions are taken out. Net pay is always less than gross pay.',
          ],
          es: [
            'El pago bruto es la cantidad total que ganas antes de restar nada — por ejemplo, trabajar 20 horas a $15/hora te da $300 de pago bruto.',
            'El pago neto (también llamado "pago a casa") es lo que realmente llega a tu cuenta bancaria después de restar impuestos y otras deducciones. El pago neto siempre es menor que el pago bruto.',
          ],
        },
      },
      {
        heading: { en: 'Where does the rest go?', es: '¿A dónde va el resto?' },
        body: {
          en: [
            'Employers are required to withhold (hold back) money from every paycheck for taxes: federal income tax, and FICA taxes (Social Security and Medicare). Some states also withhold state income tax.',
            'These deductions fund government programs — like roads, schools, and retirement benefits — that you and your community rely on.',
          ],
          es: [
            'Los empleadores están obligados a retener dinero de cada cheque para impuestos: el impuesto federal sobre la renta, y los impuestos FICA (Seguro Social y Medicare). Algunos estados también retienen impuesto estatal.',
            'Estas deducciones financian programas del gobierno — como carreteras, escuelas y beneficios de jubilación — de los que tú y tu comunidad dependen.',
          ],
        },
      },
    ],
    quiz: [
      {
        q: { en: 'Malik works 10 hours at $12/hour. What is his gross pay?', es: 'Malik trabaja 10 horas a $12/hora. ¿Cuál es su pago bruto?' },
        choices: [
          { en: '$100', es: '$100' },
          { en: '$120', es: '$120' },
          { en: '$12', es: '$12' },
          { en: '$1,200', es: '$1,200' },
        ],
        correct: 1,
        explain: { en: '10 hours × $12/hour = $120 gross pay, before any deductions.', es: '10 horas × $12/hora = $120 de pago bruto, antes de deducciones.' },
      },
      {
        q: { en: 'Which of these best describes "net pay"?', es: '¿Cuál describe mejor el "pago neto"?' },
        choices: [
          { en: 'Total pay before taxes', es: 'Pago total antes de impuestos' },
          { en: 'The amount you actually take home after deductions', es: 'La cantidad que realmente recibes después de deducciones' },
          { en: 'Your hourly wage', es: 'Tu salario por hora' },
          { en: 'Money you owe the government', es: 'Dinero que le debes al gobierno' },
        ],
        correct: 1,
        explain: { en: 'Net pay is take-home pay — what is left after taxes and deductions are subtracted from gross pay.', es: 'El pago neto es lo que te llevas a casa — lo que queda después de restar impuestos y deducciones del pago bruto.' },
      },
      {
        q: { en: 'FICA taxes fund which two programs?', es: '¿Los impuestos FICA financian cuáles dos programas?' },
        choices: [
          { en: 'Social Security and Medicare', es: 'Seguro Social y Medicare' },
          { en: 'Public schools and libraries', es: 'Escuelas públicas y bibliotecas' },
          { en: 'Roads and parks', es: 'Carreteras y parques' },
          { en: 'The stock market', es: 'El mercado de valores' },
        ],
        correct: 0,
        explain: { en: 'FICA stands for the Federal Insurance Contributions Act, which funds Social Security and Medicare.', es: 'FICA financia el Seguro Social y Medicare.' },
      },
      {
        q: { en: 'True or false: Net pay is usually more than gross pay.', es: 'Verdadero o falso: El pago neto suele ser mayor que el pago bruto.' },
        choices: [
          { en: 'True', es: 'Verdadero' },
          { en: 'False', es: 'Falso' },
        ],
        correct: 1,
        explain: { en: 'False — net pay is always less than or equal to gross pay, since taxes and deductions are subtracted.', es: 'Falso — el pago neto siempre es menor o igual al pago bruto, ya que se restan impuestos y deducciones.' },
      },
      {
        q: { en: 'Besides a job, which is another possible source of income?', es: 'Además de un trabajo, ¿cuál es otra posible fuente de ingreso?' },
        choices: [
          { en: 'Interest earned on savings', es: 'Interés ganado en ahorros' },
          { en: 'Your grade point average', es: 'Tu promedio de calificaciones' },
          { en: 'Your age', es: 'Tu edad' },
          { en: 'Your favorite color', es: 'Tu color favorito' },
        ],
        correct: 0,
        explain: { en: 'Interest, tips, gifts, and investment earnings are all sources of income beyond a regular paycheck.', es: 'El interés, las propinas, los regalos y las ganancias de inversión son fuentes de ingreso además del sueldo regular.' },
      },
    ],
  },

  {
    id: 'budgeting',
    icon: '📊',
    color: '#1e3a5f',
    colorDim: 'rgba(30,58,95,0.10)',
    colorBorder: 'rgba(30,58,95,0.30)',
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

  {
    id: 'saving',
    icon: '🏦',
    color: '#a3790a',
    colorDim: 'rgba(163,121,10,0.10)',
    colorBorder: 'rgba(163,121,10,0.30)',
    title: { en: 'Saving & Compound Interest', es: 'Ahorro e Interés Compuesto' },
    tagline: {
      en: 'How your money can earn more money over time.',
      es: 'Cómo tu dinero puede generar más dinero con el tiempo.',
    },
    tool: 'interest',
    lesson: [
      {
        heading: { en: 'Why save?', es: '¿Por qué ahorrar?' },
        body: {
          en: [
            'Saving means setting money aside instead of spending it now, so it is available later — for emergencies, big purchases, or long-term goals like a car or college.',
            'Financial experts recommend building an emergency fund of 3–6 months of expenses, kept somewhere safe and easy to access, like a savings account.',
          ],
          es: [
            'Ahorrar significa apartar dinero en lugar de gastarlo ahora, para que esté disponible después — para emergencias, compras grandes o metas a largo plazo como un auto o la universidad.',
            'Los expertos financieros recomiendan crear un fondo de emergencia de 3 a 6 meses de gastos, guardado en un lugar seguro y de fácil acceso, como una cuenta de ahorros.',
          ],
        },
      },
      {
        heading: { en: 'Simple interest vs. compound interest', es: 'Interés simple vs. interés compuesto' },
        body: {
          en: [
            'Simple interest is earned only on your original deposit (the principal). Compound interest is earned on your principal AND on the interest you have already earned — so your money grows faster over time.',
            'This is often summarized as "interest on interest." The longer your money sits and compounds, the bigger the snowball effect becomes.',
          ],
          es: [
            'El interés simple se gana solo sobre tu depósito original (el capital). El interés compuesto se gana sobre tu capital Y sobre el interés que ya ganaste — así que tu dinero crece más rápido con el tiempo.',
            'Esto se resume a menudo como "interés sobre interés". Cuanto más tiempo esté tu dinero creciendo, mayor será el efecto de bola de nieve.',
          ],
        },
      },
      {
        heading: { en: 'The formula', es: 'La fórmula' },
        body: {
          en: [
            'Compound interest can be calculated with: A = P(1 + r/n)^(nt), where P is the principal, r is the annual interest rate (as a decimal), n is the number of times interest compounds per year, and t is the number of years.',
            'You do not need to memorize this for daily life — but understanding that starting early and letting time pass makes a huge difference is one of the most powerful ideas in personal finance.',
          ],
          es: [
            'El interés compuesto se calcula con: A = P(1 + r/n)^(nt), donde P es el capital, r es la tasa de interés anual (en decimal), n es el número de veces que se capitaliza por año, y t es el número de años.',
            'No necesitas memorizar esto para la vida diaria — pero entender que empezar temprano y dejar pasar el tiempo hace una gran diferencia es una de las ideas más poderosas en las finanzas personales.',
          ],
        },
      },
    ],
    quiz: [
      {
        q: { en: 'What is the main difference between simple and compound interest?', es: '¿Cuál es la principal diferencia entre interés simple y compuesto?' },
        choices: [
          { en: 'Compound interest earns on both principal and previously earned interest', es: 'El interés compuesto se gana sobre el capital y el interés ya ganado' },
          { en: 'Simple interest is always higher', es: 'El interés simple siempre es mayor' },
          { en: 'There is no difference', es: 'No hay diferencia' },
          { en: 'Compound interest only applies to loans', es: 'El interés compuesto solo aplica a préstamos' },
        ],
        correct: 0,
        explain: { en: 'Compound interest grows faster because it earns "interest on interest," not just on the original amount.', es: 'El interés compuesto crece más rápido porque gana "interés sobre interés", no solo sobre la cantidad original.' },
      },
      {
        q: { en: 'How many months of expenses do experts typically recommend for an emergency fund?', es: '¿Cuántos meses de gastos recomiendan típicamente los expertos para un fondo de emergencia?' },
        choices: [
          { en: '3–6 months', es: '3 a 6 meses' },
          { en: '1 week', es: '1 semana' },
          { en: '10 years', es: '10 años' },
          { en: '1 day', es: '1 día' },
        ],
        correct: 0,
        explain: { en: 'A 3–6 month emergency fund is a common recommendation to cover unexpected costs like job loss or medical bills.', es: 'Un fondo de emergencia de 3 a 6 meses es una recomendación común para cubrir costos inesperados.' },
      },
      {
        q: { en: 'In the formula A = P(1 + r/n)^(nt), what does "t" represent?', es: 'En la fórmula A = P(1 + r/n)^(nt), ¿qué representa "t"?' },
        choices: [
          { en: 'The number of years', es: 'El número de años' },
          { en: 'The tax rate', es: 'La tasa de impuesto' },
          { en: 'The total balance', es: 'El saldo total' },
          { en: 'The bank\'s name', es: 'El nombre del banco' },
        ],
        correct: 0,
        explain: { en: 't' + ' stands for time in years — the longer t is, the more the interest compounds.', es: 't representa el tiempo en años — cuanto mayor sea t, más se capitaliza el interés.' },
      },
      {
        q: { en: 'Why does starting to save early matter so much?', es: '¿Por qué importa tanto empezar a ahorrar temprano?' },
        choices: [
          { en: 'More time lets compound interest grow your money more', es: 'Más tiempo permite que el interés compuesto haga crecer más tu dinero' },
          { en: 'Banks only accept deposits from teenagers', es: 'Los bancos solo aceptan depósitos de adolescentes' },
          { en: 'Interest rates are higher for younger people', es: 'Las tasas de interés son más altas para personas jóvenes' },
          { en: 'It doesn\'t matter when you start', es: 'No importa cuándo empiezas' },
        ],
        correct: 0,
        explain: { en: 'Time is one of the biggest factors in compound growth — starting early gives your money more time to compound.', es: 'El tiempo es uno de los factores más importantes en el crecimiento compuesto — empezar temprano le da a tu dinero más tiempo para crecer.' },
      },
      {
        q: { en: 'Which account type is generally best for an emergency fund?', es: '¿Qué tipo de cuenta es generalmente mejor para un fondo de emergencia?' },
        choices: [
          { en: 'A savings account you can access quickly', es: 'Una cuenta de ahorros de fácil acceso' },
          { en: 'Cash hidden under a mattress', es: 'Efectivo escondido bajo el colchón' },
          { en: 'Stocks that can lose value quickly', es: 'Acciones que pueden perder valor rápidamente' },
          { en: 'A collection of video games', es: 'Una colección de videojuegos' },
        ],
        correct: 0,
        explain: { en: 'A savings account is safe, earns some interest, and lets you access your money quickly when you need it.', es: 'Una cuenta de ahorros es segura, gana algo de interés y te permite acceder a tu dinero rápidamente cuando lo necesites.' },
      },
    ],
  },

  {
    id: 'banking',
    icon: '🏧',
    color: '#0f6b66',
    colorDim: 'rgba(15,107,102,0.10)',
    colorBorder: 'rgba(15,107,102,0.30)',
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

  {
    id: 'credit',
    icon: '💳',
    color: '#7a2e3a',
    colorDim: 'rgba(122,46,58,0.10)',
    colorBorder: 'rgba(122,46,58,0.30)',
    title: { en: 'Credit & Debt', es: 'Crédito y Deudas' },
    tagline: {
      en: 'Borrowing money responsibly and understanding your credit score.',
      es: 'Pedir dinero prestado con responsabilidad y entender tu puntaje de crédito.',
    },
    lesson: [
      {
        heading: { en: 'What is credit?', es: '¿Qué es el crédito?' },
        body: {
          en: [
            'Credit is the ability to borrow money now with a promise to pay it back later, usually with interest. Common forms of credit include credit cards, car loans, and student loans.',
            'Using credit responsibly — borrowing only what you can repay, and paying on time — helps build a strong financial reputation.',
          ],
          es: [
            'El crédito es la capacidad de pedir dinero prestado ahora con la promesa de devolverlo después, generalmente con interés. Formas comunes de crédito incluyen tarjetas de crédito, préstamos de auto y préstamos estudiantiles.',
            'Usar el crédito responsablemente — pidiendo prestado solo lo que puedes pagar, y pagando a tiempo — ayuda a construir una buena reputación financiera.',
          ],
        },
      },
      {
        heading: { en: 'What is a credit score?', es: '¿Qué es un puntaje de crédito?' },
        body: {
          en: [
            'A credit score is a number (typically 300-850) that estimates how likely you are to repay borrowed money. Lenders, landlords, and even some employers use it to judge financial trustworthiness.',
            'Five main factors affect your score: payment history, amounts owed, length of credit history, new credit inquiries, and credit mix (types of credit you use).',
          ],
          es: [
            'Un puntaje de crédito es un número (normalmente entre 300-850) que estima qué tan probable es que devuelvas el dinero prestado. Prestamistas, arrendadores e incluso algunos empleadores lo usan para juzgar tu confiabilidad financiera.',
            'Cinco factores principales afectan tu puntaje: historial de pagos, cantidades adeudadas, duración del historial crediticio, nuevas solicitudes de crédito, y la mezcla de crédito (tipos de crédito que usas).',
          ],
        },
      },
      {
        heading: { en: 'Interest, APR, and the cost of debt', es: 'Interés, TAE y el costo de la deuda' },
        body: {
          en: [
            'APR (Annual Percentage Rate) is the yearly cost of borrowing money, including interest and fees, shown as a percentage. A lower APR means borrowing costs you less over time.',
            'Carrying a balance on a high-interest credit card can quickly turn a small purchase into a much larger debt. Paying only the "minimum payment" each month can take years to pay off and cost far more in interest.',
          ],
          es: [
            'La TAE (Tasa Anual Equivalente) es el costo anual de pedir dinero prestado, incluyendo interés y tarifas, mostrado como un porcentaje. Una TAE más baja significa que pedir prestado te cuesta menos con el tiempo.',
            'Mantener un saldo en una tarjeta de crédito de interés alto puede convertir rápidamente una compra pequeña en una deuda mucho más grande. Pagar solo el "pago mínimo" cada mes puede tardar años en liquidarse y costar mucho más en intereses.',
          ],
        },
      },
    ],
    quiz: [
      {
        q: { en: 'What is a credit score used for?', es: '¿Para qué se usa un puntaje de crédito?' },
        choices: [
          { en: 'To estimate how likely you are to repay borrowed money', es: 'Para estimar qué tan probable es que devuelvas dinero prestado' },
          { en: 'To measure your grades in school', es: 'Para medir tus calificaciones escolares' },
          { en: 'To set your hourly wage', es: 'Para fijar tu salario por hora' },
          { en: 'To determine your age', es: 'Para determinar tu edad' },
        ],
        correct: 0,
        explain: { en: 'Lenders use credit scores to judge the risk of lending you money.', es: 'Los prestamistas usan el puntaje de crédito para evaluar el riesgo de prestarte dinero.' },
      },
      {
        q: { en: 'Which of these is NOT one of the five main factors in a credit score?', es: '¿Cuál de estos NO es uno de los cinco factores principales de un puntaje de crédito?' },
        choices: [
          { en: 'Your favorite bank\'s logo color', es: 'El color del logo de tu banco favorito' },
          { en: 'Payment history', es: 'Historial de pagos' },
          { en: 'Amounts owed', es: 'Cantidades adeudadas' },
          { en: 'Length of credit history', es: 'Duración del historial crediticio' },
        ],
        correct: 0,
        explain: { en: 'The five real factors are payment history, amounts owed, length of history, new credit, and credit mix.', es: 'Los cinco factores reales son historial de pagos, cantidades adeudadas, duración del historial, nuevo crédito y mezcla de crédito.' },
      },
      {
        q: { en: 'What does APR stand for?', es: '¿Qué significa TAE?' },
        choices: [
          { en: 'Annual Percentage Rate', es: 'Tasa Anual Equivalente' },
          { en: 'Average Payment Requirement', es: 'Requisito de Pago Promedio' },
          { en: 'Approved Personal Rate', es: 'Tasa Personal Aprobada' },
          { en: 'Automatic Payment Reminder', es: 'Recordatorio de Pago Automático' },
        ],
        correct: 0,
        explain: { en: 'APR (Annual Percentage Rate) shows the yearly cost of borrowing as a percentage.', es: 'La TAE muestra el costo anual de pedir prestado como un porcentaje.' },
      },
      {
        q: { en: 'Why can paying only the "minimum payment" on a credit card be risky?', es: '¿Por qué puede ser riesgoso pagar solo el "pago mínimo" de una tarjeta de crédito?' },
        choices: [
          { en: 'It can take years to pay off and cost much more in interest', es: 'Puede tardar años en pagarse y costar mucho más en intereses' },
          { en: 'It immediately raises your credit score to 850', es: 'Sube inmediatamente tu puntaje de crédito a 850' },
          { en: 'It pays off the entire balance instantly', es: 'Paga el saldo completo al instante' },
          { en: 'Banks do not allow minimum payments', es: 'Los bancos no permiten pagos mínimos' },
        ],
        correct: 0,
        explain: { en: 'Minimum payments keep an account "current" but let interest pile up on the remaining balance for a very long time.', es: 'Los pagos mínimos mantienen la cuenta "al corriente" pero dejan que el interés se acumule sobre el saldo restante durante mucho tiempo.' },
      },
      {
        q: { en: 'What is one way to use credit responsibly?', es: '¿Cuál es una forma de usar el crédito responsablemente?' },
        choices: [
          { en: 'Only borrow what you can repay, and pay on time', es: 'Pedir prestado solo lo que puedes pagar, y pagar a tiempo' },
          { en: 'Max out every credit card you own', es: 'Agotar el límite de cada tarjeta de crédito que tengas' },
          { en: 'Ignore due dates', es: 'Ignorar las fechas límite' },
          { en: 'Never check your credit score', es: 'Nunca revisar tu puntaje de crédito' },
        ],
        correct: 0,
        explain: { en: 'Borrowing within your means and paying on time are the two biggest habits for responsible credit use.', es: 'Pedir prestado dentro de tus posibilidades y pagar a tiempo son los dos hábitos más importantes para el uso responsable del crédito.' },
      },
    ],
  },
]
