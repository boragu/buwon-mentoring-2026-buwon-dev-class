export type Choice = {
  tex: string
  value: number
}

type BaseQuestion = {
  id: number
  points: number
  prompt: string
  solution: string[]
  verify: () => number
}

export type MultipleChoiceQuestion = BaseQuestion & {
  type: 'mc'
  choices: Choice[]
  answerIndex: number
}

export type ShortAnswerQuestion = BaseQuestion & {
  type: 'short'
  answer: string
}

export type Question = MultipleChoiceQuestion | ShortAnswerQuestion

export const CHOICE_MARKERS = ['①', '②', '③', '④', '⑤'] as const

const n = (value: number): Choice => ({ tex: String(value), value })
const frac = (num: number, den: number): Choice => ({
  tex: `\\dfrac{${num}}{${den}}`,
  value: num / den,
})

function simpson(f: (x: number) => number, a: number, b: number, steps = 2000) {
  const h = (b - a) / steps
  let sum = f(a) + f(b)
  for (let i = 1; i < steps; i++) sum += f(a + i * h) * (i % 2 === 0 ? 2 : 4)
  return (sum * h) / 3
}

function combinations(total: number, pick: number) {
  let result = 1
  for (let i = 0; i < pick; i++) result = (result * (total - i)) / (i + 1)
  return result
}

export const QUESTIONS: Question[] = [
  {
    id: 1,
    type: 'mc',
    points: 3,
    prompt: '$2^3 \\times 2^2$ 의 값은?',
    choices: [n(16), n(24), n(32), n(64), n(128)],
    answerIndex: 2,
    solution: [
      '밑이 같은 거듭제곱의 곱은 지수끼리 더합니다.',
      '$2^3 \\times 2^2 = 2^{3+2} = 2^5 = 32$',
    ],
    verify: () => 2 ** 3 * 2 ** 2,
  },
  {
    id: 2,
    type: 'mc',
    points: 3,
    prompt: '$\\sqrt{12} \\times \\sqrt{3}$ 의 값은?',
    choices: [n(3), n(4), n(6), n(9), n(12)],
    answerIndex: 2,
    solution: [
      '근호 안의 수끼리 곱할 수 있습니다.',
      '$\\sqrt{12} \\times \\sqrt{3} = \\sqrt{36} = 6$',
    ],
    verify: () => Math.sqrt(12) * Math.sqrt(3),
  },
  {
    id: 3,
    type: 'mc',
    points: 3,
    prompt: '일차방정식 $3x - 7 = 11$ 의 해는?',
    choices: [n(4), n(5), n(6), n(7), n(8)],
    answerIndex: 2,
    solution: ['양변에 $7$ 을 더하면 $3x = 18$', '양변을 $3$ 으로 나누면 $x = 6$'],
    verify: () => (11 + 7) / 3,
  },
  {
    id: 4,
    type: 'mc',
    points: 3,
    prompt: '$\\dfrac{2}{3} + \\dfrac{5}{6}$ 의 값은?',
    choices: [frac(7, 9), n(1), frac(7, 6), frac(3, 2), n(2)],
    answerIndex: 3,
    solution: [
      '분모를 $6$ 으로 통분합니다.',
      '$\\dfrac{4}{6} + \\dfrac{5}{6} = \\dfrac{9}{6} = \\dfrac{3}{2}$',
    ],
    verify: () => 2 / 3 + 5 / 6,
  },
  {
    id: 5,
    type: 'mc',
    points: 4,
    prompt:
      '이차방정식 $x^2 - 5x + 6 = 0$ 의 두 근을 $\\alpha, \\beta$ 라 할 때, $\\alpha^2 + \\beta^2$ 의 값은?',
    choices: [n(11), n(12), n(13), n(14), n(15)],
    answerIndex: 2,
    solution: [
      '근과 계수의 관계에서 $\\alpha + \\beta = 5$, $\\alpha\\beta = 6$',
      '$\\alpha^2 + \\beta^2 = (\\alpha + \\beta)^2 - 2\\alpha\\beta = 25 - 12 = 13$',
    ],
    verify: () => {
      const d = Math.sqrt(25 - 24)
      const r1 = (5 + d) / 2
      const r2 = (5 - d) / 2
      return r1 ** 2 + r2 ** 2
    },
  },
  {
    id: 6,
    type: 'mc',
    points: 4,
    prompt: '첫째항이 $3$, 공차가 $4$ 인 등차수열의 제$10$항은?',
    choices: [n(35), n(37), n(39), n(41), n(43)],
    answerIndex: 2,
    solution: [
      '등차수열의 일반항은 $a_n = a_1 + (n-1)d$',
      '$a_{10} = 3 + 9 \\times 4 = 39$',
    ],
    verify: () => {
      let term = 3
      for (let i = 1; i < 10; i++) term += 4
      return term
    },
  },
  {
    id: 7,
    type: 'mc',
    points: 4,
    prompt: '$\\log_2 8 + \\log_3 81$ 의 값은?',
    choices: [n(5), n(6), n(7), n(8), n(12)],
    answerIndex: 2,
    solution: [
      '$8 = 2^3$ 이므로 $\\log_2 8 = 3$, $81 = 3^4$ 이므로 $\\log_3 81 = 4$',
      '따라서 $3 + 4 = 7$',
    ],
    verify: () => Math.log(8) / Math.log(2) + Math.log(81) / Math.log(3),
  },
  {
    id: 8,
    type: 'mc',
    points: 4,
    prompt: '이차함수 $f(x) = x^2 - 4x + 7$ 의 최솟값은?',
    choices: [n(1), n(2), n(3), n(4), n(7)],
    answerIndex: 2,
    solution: [
      '완전제곱식으로 바꾸면 $f(x) = (x-2)^2 + 3$',
      '$x = 2$ 일 때 최솟값 $3$ 을 가집니다.',
    ],
    verify: () => {
      const vertex = 4 / 2
      return vertex ** 2 - 4 * vertex + 7
    },
  },
  {
    id: 9,
    type: 'mc',
    points: 4,
    prompt: '$\\sin 30^\\circ + \\cos 60^\\circ + \\tan 45^\\circ$ 의 값은?',
    choices: [n(1), frac(3, 2), n(2), frac(5, 2), n(3)],
    answerIndex: 2,
    solution: [
      '$\\sin 30^\\circ = \\dfrac{1}{2}$, $\\cos 60^\\circ = \\dfrac{1}{2}$, $\\tan 45^\\circ = 1$',
      '따라서 $\\dfrac{1}{2} + \\dfrac{1}{2} + 1 = 2$',
    ],
    verify: () => {
      const rad = (deg: number) => (deg * Math.PI) / 180
      return Math.sin(rad(30)) + Math.cos(rad(60)) + Math.tan(rad(45))
    },
  },
  {
    id: 10,
    type: 'mc',
    points: 4,
    prompt:
      '연립방정식 $\\begin{cases} x + y = 7 \\\\ x - y = 3 \\end{cases}$ 의 해를 $x = a,\\ y = b$ 라 할 때, $ab$ 의 값은?',
    choices: [n(8), n(10), n(12), n(14), n(21)],
    answerIndex: 1,
    solution: [
      '두 식을 더하면 $2x = 10$ 이므로 $x = 5$',
      '$y = 7 - 5 = 2$ 이므로 $ab = 5 \\times 2 = 10$',
    ],
    verify: () => {
      const x = (7 + 3) / 2
      const y = 7 - x
      return x * y
    },
  },
  {
    id: 11,
    type: 'mc',
    points: 4,
    prompt: '서로 다른 $6$ 명 중에서 대표 $1$ 명과 부대표 $1$ 명을 뽑는 경우의 수는?',
    choices: [n(12), n(15), n(25), n(30), n(36)],
    answerIndex: 3,
    solution: [
      '순서가 있는 선택이므로 순열을 이용합니다.',
      '대표 $6$ 가지, 부대표 $5$ 가지이므로 $6 \\times 5 = 30$',
    ],
    verify: () => {
      let count = 0
      for (let a = 0; a < 6; a++) for (let b = 0; b < 6; b++) if (a !== b) count++
      return count
    },
  },
  {
    id: 12,
    type: 'mc',
    points: 5,
    prompt: '$\\displaystyle \\lim_{x \\to 2} \\frac{x^2 - 4}{x - 2}$ 의 값은?',
    choices: [n(0), n(1), n(2), n(4), n(8)],
    answerIndex: 3,
    solution: [
      '분자를 인수분해하면 $x^2 - 4 = (x-2)(x+2)$',
      '약분하면 $\\displaystyle \\lim_{x \\to 2} (x + 2) = 4$',
    ],
    verify: () => {
      const f = (x: number) => (x ** 2 - 4) / (x - 2)
      return (f(2 - 1e-7) + f(2 + 1e-7)) / 2
    },
  },
  {
    id: 13,
    type: 'mc',
    points: 5,
    prompt: '함수 $f(x) = x^3 - 3x^2 + 2$ 에 대하여 $f\'(3)$ 의 값은?',
    choices: [n(3), n(6), n(9), n(12), n(15)],
    answerIndex: 2,
    solution: [
      "$f'(x) = 3x^2 - 6x$",
      "$f'(3) = 27 - 18 = 9$",
    ],
    verify: () => {
      const f = (x: number) => x ** 3 - 3 * x ** 2 + 2
      const h = 1e-5
      return (f(3 + h) - f(3 - h)) / (2 * h)
    },
  },
  {
    id: 14,
    type: 'mc',
    points: 5,
    prompt: '$\\displaystyle \\int_0^2 (3x^2 + 2x)\\,dx$ 의 값은?',
    choices: [n(8), n(10), n(12), n(14), n(16)],
    answerIndex: 2,
    solution: [
      '부정적분은 $x^3 + x^2$',
      '$\\left[x^3 + x^2\\right]_0^2 = 8 + 4 = 12$',
    ],
    verify: () => simpson((x) => 3 * x ** 2 + 2 * x, 0, 2),
  },
  {
    id: 15,
    type: 'mc',
    points: 5,
    prompt: '첫째항이 $2$, 공비가 $3$ 인 등비수열의 첫째항부터 제$5$항까지의 합은?',
    choices: [n(160), n(202), n(242), n(486), n(728)],
    answerIndex: 2,
    solution: [
      '등비수열의 합 공식 $S_n = \\dfrac{a(r^n - 1)}{r - 1}$',
      '$S_5 = \\dfrac{2(3^5 - 1)}{3 - 1} = 3^5 - 1 = 242$',
    ],
    verify: () => {
      let sum = 0
      for (let k = 0; k < 5; k++) sum += 2 * 3 ** k
      return sum
    },
  },
  {
    id: 16,
    type: 'short',
    points: 8,
    prompt: '$x + \\dfrac{1}{x} = 4$ 일 때, $x^3 + \\dfrac{1}{x^3}$ 의 값을 구하시오.',
    answer: '52',
    solution: [
      '$x^3 + \\dfrac{1}{x^3} = \\left(x + \\dfrac{1}{x}\\right)^3 - 3\\left(x + \\dfrac{1}{x}\\right)$',
      '$= 4^3 - 3 \\times 4 = 64 - 12 = 52$',
    ],
    verify: () => {
      const x = 2 + Math.sqrt(3)
      return x ** 3 + 1 / x ** 3
    },
  },
  {
    id: 17,
    type: 'short',
    points: 8,
    prompt:
      '남학생 $4$ 명, 여학생 $3$ 명 중에서 $3$ 명을 뽑을 때, 여학생이 적어도 $1$ 명 포함되는 경우의 수를 구하시오.',
    answer: '31',
    solution: [
      '전체 경우의 수에서 남학생만 뽑는 경우를 뺍니다.',
      '${}_7\\mathrm{C}_3 - {}_4\\mathrm{C}_3 = 35 - 4 = 31$',
    ],
    verify: () => combinations(7, 3) - combinations(4, 3),
  },
  {
    id: 18,
    type: 'short',
    points: 8,
    prompt:
      '곡선 $y = x^2$ 과 직선 $y = 2x + 3$ 으로 둘러싸인 부분의 넓이를 $S$ 라 할 때, $3S$ 의 값을 구하시오.',
    answer: '32',
    solution: [
      '교점: $x^2 = 2x + 3 \\Rightarrow (x-3)(x+1) = 0$ 이므로 $x = -1, 3$',
      '$S = \\displaystyle\\int_{-1}^{3} (2x + 3 - x^2)\\,dx = \\dfrac{(3 - (-1))^3}{6} = \\dfrac{32}{3}$',
      '따라서 $3S = 32$',
    ],
    verify: () => 3 * simpson((x) => 2 * x + 3 - x ** 2, -1, 3),
  },
  {
    id: 19,
    type: 'short',
    points: 8,
    prompt: '수열 $\\{a_n\\}$ 이 $a_1 = 1$, $a_{n+1} = 2a_n + 1$ 을 만족할 때, $a_{10}$ 의 값을 구하시오.',
    answer: '1023',
    solution: [
      '양변에 $1$ 을 더하면 $a_{n+1} + 1 = 2(a_n + 1)$',
      '$a_n + 1$ 은 첫째항 $2$, 공비 $2$ 인 등비수열이므로 $a_n = 2^n - 1$',
      '$a_{10} = 2^{10} - 1 = 1023$',
    ],
    verify: () => {
      let a = 1
      for (let i = 1; i < 10; i++) a = 2 * a + 1
      return a
    },
  },
  {
    id: 20,
    type: 'short',
    points: 8,
    prompt:
      '함수 $f(x) = x^3 - 6x^2 + 9x + 1$ 의 극댓값을 $M$, 극솟값을 $m$ 이라 할 때, $M + m$ 의 값을 구하시오.',
    answer: '6',
    solution: [
      "$f'(x) = 3x^2 - 12x + 9 = 3(x-1)(x-3)$",
      '$x = 1$ 에서 극대: $M = f(1) = 5$, $x = 3$ 에서 극소: $m = f(3) = 1$',
      '따라서 $M + m = 6$',
    ],
    verify: () => {
      const f = (x: number) => x ** 3 - 6 * x ** 2 + 9 * x + 1
      const disc = Math.sqrt(144 - 4 * 3 * 9)
      const c1 = (12 - disc) / 6
      const c2 = (12 + disc) / 6
      return f(c1) + f(c2)
    },
  },
]
