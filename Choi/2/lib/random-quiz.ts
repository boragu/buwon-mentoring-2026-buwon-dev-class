import type { Category, Difficulty, QuizQuestion, Rarity } from './quiz-data'

export const NATIONAL_DEX_SIZE = 1025
export const RANDOM_QUIZ_SIZE = 25

const API = 'https://pokeapi.co/api/v2'

const TYPE_KO: Record<string, string> = {
  normal: '노말',
  fire: '불꽃',
  water: '물',
  grass: '풀',
  electric: '전기',
  ice: '얼음',
  fighting: '격투',
  poison: '독',
  ground: '땅',
  flying: '비행',
  psychic: '에스퍼',
  bug: '벌레',
  rock: '바위',
  ghost: '고스트',
  dragon: '드래곤',
  dark: '악',
  steel: '강철',
  fairy: '페어리',
}

const GENERATIONS = [
  { name: 'generation-i', label: '1세대 (관동)' },
  { name: 'generation-ii', label: '2세대 (성도)' },
  { name: 'generation-iii', label: '3세대 (호연)' },
  { name: 'generation-iv', label: '4세대 (신오)' },
  { name: 'generation-v', label: '5세대 (하나)' },
  { name: 'generation-vi', label: '6세대 (칼로스)' },
  { name: 'generation-vii', label: '7세대 (알로라)' },
  { name: 'generation-viii', label: '8세대 (가라르)' },
  { name: 'generation-ix', label: '9세대 (팔데아)' },
]

const ULTRA_BEASTS = new Set([793, 794, 795, 796, 797, 798, 799, 803, 804, 805, 806])

interface LocalizedName {
  name: string
  language: { name: string }
}

interface SpeciesResponse {
  id: number
  names: LocalizedName[]
  genera: { genus: string; language: { name: string } }[]
  flavor_text_entries: { flavor_text: string; language: { name: string } }[]
  generation: { name: string }
  is_legendary: boolean
  is_mythical: boolean
  capture_rate: number
}

interface PokemonResponse {
  types: { slot: number; type: { name: string } }[]
}

interface PokemonEntry {
  dexNo: number
  name: string
  genus: string
  flavor: string
  types: string[]
  generationIndex: number
  rarity: Rarity
}

function shuffle<T>(items: T[]) {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function pickRandomDexNumbers(count: number) {
  const picked = new Set<number>()
  while (picked.size < count) picked.add(Math.floor(Math.random() * NATIONAL_DEX_SIZE) + 1)
  return [...picked]
}

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { next: { revalidate: 60 * 60 * 24 * 7 } })
  if (!res.ok) throw new Error(`PokeAPI ${res.status}: ${url}`)
  return res.json() as Promise<T>
}

function getRarity(species: SpeciesResponse): Rarity {
  if (species.is_mythical) return 'mythical'
  if (species.is_legendary) return 'legendary'
  if (ULTRA_BEASTS.has(species.id)) return 'special'
  if (species.capture_rate <= 45) return 'rare'
  return 'common'
}

async function fetchPokemon(dexNo: number): Promise<PokemonEntry> {
  const [species, pokemon] = await Promise.all([
    getJson<SpeciesResponse>(`${API}/pokemon-species/${dexNo}`),
    getJson<PokemonResponse>(`${API}/pokemon/${dexNo}`),
  ])
  const ko = (list: LocalizedName[]) => list.find((n) => n.language.name === 'ko')?.name
  const name = ko(species.names) ?? species.names.find((n) => n.language.name === 'en')?.name
  if (!name) throw new Error(`No name for ${dexNo}`)
  const koFlavors = species.flavor_text_entries.filter((f) => f.language.name === 'ko')
  const flavor = (koFlavors.at(-1)?.flavor_text ?? '').replace(/[\n\f\r]+/g, ' ').trim()
  const genus = species.genera.find((g) => g.language.name === 'ko')?.genus ?? '포켓몬'
  const types = [...pokemon.types]
    .sort((a, b) => a.slot - b.slot)
    .map((t) => TYPE_KO[t.type.name] ?? t.type.name)
  const generationIndex = Math.max(0, GENERATIONS.findIndex((g) => g.name === species.generation.name))
  return { dexNo, name, genus, flavor, types, generationIndex, rarity: getRarity(species) }
}

function difficultyFor(entry: PokemonEntry, base: Difficulty): Difficulty {
  if (base === 'hard') return 'hard'
  if (entry.generationIndex === 0) return base
  if (entry.generationIndex >= 4) return base === 'easy' ? 'normal' : 'hard'
  return base === 'easy' ? 'normal' : base
}

function buildOptions(correct: string, candidates: string[]) {
  const distractors = shuffle([...new Set(candidates.filter((c) => c !== correct))]).slice(0, 3)
  const options = shuffle([correct, ...distractors]) as [string, string, string, string]
  return { options, answer: options.indexOf(correct) }
}

function randomTypeCombo() {
  const names = Object.values(TYPE_KO)
  const [a, b] = shuffle(names)
  return Math.random() < 0.5 ? a : `${a}/${b}`
}

type QuestionKind = 'silhouette' | 'type' | 'generation' | 'genus' | 'dexno'

const KIND_CATEGORY: Record<QuestionKind, Category> = {
  silhouette: '실루엣 퀴즈',
  type: '타입 퀴즈',
  generation: '세대 퀴즈',
  genus: '분류 퀴즈',
  dexno: '도감 번호',
}

const KIND_DIFFICULTY: Record<QuestionKind, Difficulty> = {
  silhouette: 'easy',
  type: 'normal',
  generation: 'normal',
  genus: 'normal',
  dexno: 'hard',
}

function buildQuestion(entry: PokemonEntry, kind: QuestionKind, pool: PokemonEntry[], runId: string): QuizQuestion {
  const others = pool.filter((p) => p.dexNo !== entry.dexNo)
  const otherNames = others.map((p) => p.name)
  const typeText = entry.types.join('/')
  const genLabel = GENERATIONS[entry.generationIndex].label

  let question: string
  let built: { options: [string, string, string, string]; answer: number }

  switch (kind) {
    case 'silhouette':
      question = '이 실루엣의 포켓몬은 누구일까요?'
      built = buildOptions(entry.name, otherNames)
      break
    case 'type': {
      question = `${entry.name}의 타입은 무엇일까요?`
      const candidates = others.map((p) => p.types.join('/'))
      while (new Set(candidates.filter((c) => c !== typeText)).size < 3) candidates.push(randomTypeCombo())
      built = buildOptions(typeText, candidates)
      break
    }
    case 'generation':
      question = `${entry.name}이(가) 처음 등장한 세대는?`
      built = buildOptions(
        genLabel,
        GENERATIONS.map((g) => g.label),
      )
      break
    case 'genus': {
      question = `'${entry.genus}'(으)로 분류되는 포켓몬은?`
      const sameGenus = new Set(pool.filter((p) => p.genus === entry.genus).map((p) => p.name))
      built = buildOptions(
        entry.name,
        otherNames.filter((n) => !sameGenus.has(n)),
      )
      break
    }
    case 'dexno': {
      question = `${entry.name}의 전국도감 번호는?`
      const nearby = new Set<number>()
      while (nearby.size < 3) {
        const offset = (Math.floor(Math.random() * 40) + 1) * (Math.random() < 0.5 ? -1 : 1)
        const n = entry.dexNo + offset
        if (n >= 1 && n <= NATIONAL_DEX_SIZE && n !== entry.dexNo) nearby.add(n)
      }
      const fmt = (n: number) => `No.${String(n).padStart(4, '0')}`
      built = buildOptions(fmt(entry.dexNo), [...nearby].map(fmt))
      break
    }
  }

  const flavorSentence = entry.flavor ? ` 도감 설명: "${entry.flavor}"` : ''

  return {
    id: `r-${runId}-${entry.dexNo}`,
    category: KIND_CATEGORY[kind],
    difficulty: difficultyFor(entry, KIND_DIFFICULTY[kind]),
    rarity: entry.rarity,
    question,
    options: built.options,
    answer: built.answer,
    explanation: `${entry.name}(No.${String(entry.dexNo).padStart(4, '0')})은(는) ${typeText} 타입의 ${entry.genus}로, ${genLabel}에 처음 등장했습니다.${flavorSentence}`,
    pokemon: { artworkId: entry.dexNo, dexNo: entry.dexNo, name: entry.name, types: entry.types },
    item: {
      name: `${entry.name} 도감 데이터`,
      description: entry.flavor || `${entry.genus} ${entry.name}의 기록이 담긴 도감 데이터입니다.`,
    },
  }
}

const KINDS: QuestionKind[] = ['silhouette', 'type', 'generation', 'genus', 'silhouette', 'dexno']

export async function buildRandomQuiz(): Promise<QuizQuestion[]> {
  const candidates = pickRandomDexNumbers(RANDOM_QUIZ_SIZE + 8)
  const settled = await Promise.allSettled(candidates.map(fetchPokemon))
  const entries = settled
    .filter((r): r is PromiseFulfilledResult<PokemonEntry> => r.status === 'fulfilled')
    .map((r) => r.value)
    .slice(0, RANDOM_QUIZ_SIZE)

  if (entries.length < RANDOM_QUIZ_SIZE) throw new Error('Not enough Pokémon data loaded')

  const runId = Date.now().toString(36)
  const kinds = shuffle(Array.from({ length: RANDOM_QUIZ_SIZE }, (_, i) => KINDS[i % KINDS.length]))
  return entries.map((entry, i) => buildQuestion(entry, kinds[i], entries, runId))
}
