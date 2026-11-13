export type Rarity =
  | 'common'
  | 'rare'
  | 'special'
  | 'legendary'
  | 'mythical'
  | 'mega'
  | 'primal'

export type Difficulty = 'easy' | 'normal' | 'hard'

export type Category =
  | '일반 포켓몬'
  | '전설의 포켓몬'
  | '환상의 포켓몬'
  | '메가진화'
  | '원시회귀'
  | '타입 상성'
  | '포켓몬 진화'
  | '포켓몬 기술'
  | '특성'
  | '포켓몬 도감'
  | '스타팅 포켓몬'
  | '지역 및 세대'
  | '울트라비스트'
  | '폼 체인지'
  | '전용 기술·아이템'
  | '실루엣 퀴즈'
  | '타입 퀴즈'
  | '세대 퀴즈'
  | '분류 퀴즈'
  | '도감 번호'

export interface RewardPokemon {
  artworkId: number
  dexNo: number
  name: string
  types: string[]
}

export interface RewardItem {
  name: string
  description: string
}

export interface QuizQuestion {
  id: string
  category: Category
  difficulty: Difficulty
  rarity: Rarity
  question: string
  options: [string, string, string, string]
  answer: number
  explanation: string
  pokemon: RewardPokemon
  item: RewardItem
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q01',
    category: '스타팅 포켓몬',
    difficulty: 'easy',
    rarity: 'common',
    question: '관동지방 스타팅 포켓몬 중 풀 타입 포켓몬은?',
    options: ['이상해씨', '파이리', '꼬부기', '피카츄'],
    answer: 0,
    explanation: '이상해씨는 풀·독 타입으로 관동지방 스타팅 포켓몬 중 하나입니다.',
    pokemon: { artworkId: 1, dexNo: 1, name: '이상해씨', types: ['풀', '독'] },
    item: { name: '몬스터볼', description: '포켓몬을 잡기 위한 가장 기본적인 볼.' },
  },
  {
    id: 'q02',
    category: '타입 상성',
    difficulty: 'easy',
    rarity: 'common',
    question: '물 타입 기술이 "효과가 굉장했다!"가 되는 타입은?',
    options: ['풀', '불꽃', '전기', '드래곤'],
    answer: 1,
    explanation: '물 타입 기술은 불꽃·땅·바위 타입에게 2배의 데미지를 줍니다.',
    pokemon: { artworkId: 7, dexNo: 7, name: '꼬부기', types: ['물'] },
    item: { name: '상처약', description: '포켓몬의 HP를 20 회복시키는 스프레이식 약.' },
  },
  {
    id: 'q03',
    category: '일반 포켓몬',
    difficulty: 'easy',
    rarity: 'common',
    question: '길 한가운데에서 잠을 자며 길을 막는 것으로 유명한 노말 타입 포켓몬은?',
    options: ['고라파덕', '푸린', '잠만보', '야돈'],
    answer: 2,
    explanation: '잠만보는 하루에 음식을 400kg이나 먹고 나면 잠만 자는 포켓몬입니다.',
    pokemon: { artworkId: 143, dexNo: 143, name: '잠만보', types: ['노말'] },
    item: { name: '포켓몬피리', description: '잠든 포켓몬을 깨우는 신비한 음색의 피리.' },
  },
  {
    id: 'q04',
    category: '포켓몬 도감',
    difficulty: 'easy',
    rarity: 'common',
    question: '전국도감 No.0025에 등록된 포켓몬은?',
    options: ['라이츄', '피츄', '피카츄', '파치리스'],
    answer: 2,
    explanation: '피카츄는 전국도감 25번으로, 포켓몬 시리즈의 마스코트입니다.',
    pokemon: { artworkId: 25, dexNo: 25, name: '피카츄', types: ['전기'] },
    item: { name: '오랭열매', description: '포켓몬에게 지니게 하면 HP를 10 회복하는 나무열매.' },
  },
  {
    id: 'q05',
    category: '타입 상성',
    difficulty: 'easy',
    rarity: 'rare',
    question: '고스트 타입 기술이 "효과가 없는(0배)" 타입은?',
    options: ['에스퍼', '노말', '악', '고스트'],
    answer: 1,
    explanation: '노말 타입은 고스트 타입 기술에 면역이며, 반대로 노말 기술도 고스트에게 통하지 않습니다.',
    pokemon: { artworkId: 94, dexNo: 94, name: '팬텀', types: ['고스트', '독'] },
    item: { name: '슈퍼볼', description: '몬스터볼보다 포켓몬을 잡기 쉬운 볼.' },
  },
  {
    id: 'q06',
    category: '스타팅 포켓몬',
    difficulty: 'easy',
    rarity: 'common',
    question: '성도지방의 불꽃 타입 스타팅 포켓몬은?',
    options: ['아차모', '브케인', '불꽃숭이', '치코리타'],
    answer: 1,
    explanation: '성도지방 스타팅은 치코리타(풀), 브케인(불꽃), 리아코(물)입니다.',
    pokemon: { artworkId: 155, dexNo: 155, name: '브케인', types: ['불꽃'] },
    item: { name: '좋은상처약', description: '포켓몬의 HP를 60 회복시키는 약.' },
  },
  {
    id: 'q07',
    category: '지역 및 세대',
    difficulty: 'easy',
    rarity: 'rare',
    question: '3세대 게임 "포켓몬스터 루비·사파이어"의 배경이 되는 지방은?',
    options: ['관동지방', '성도지방', '호연지방', '신오지방'],
    answer: 2,
    explanation: '루비·사파이어·에메랄드는 바다가 많은 호연지방을 배경으로 합니다.',
    pokemon: { artworkId: 252, dexNo: 252, name: '나무지기', types: ['풀'] },
    item: { name: '하이퍼볼', description: '매우 성능이 좋은 고성능 볼.' },
  },
  {
    id: 'q08',
    category: '일반 포켓몬',
    difficulty: 'easy',
    rarity: 'common',
    question: '다음 중 이브이의 진화형이 "아닌" 포켓몬은?',
    options: ['샤미드', '쥬피썬더', '부스터', '라프라스'],
    answer: 3,
    explanation: '라프라스는 진화하지 않는 물·얼음 타입 포켓몬입니다.',
    pokemon: { artworkId: 133, dexNo: 133, name: '이브이', types: ['노말'] },
    item: { name: '물의돌', description: '특정 포켓몬을 진화시키는 푸른 빛의 돌.' },
  },
  {
    id: 'q09',
    category: '포켓몬 진화',
    difficulty: 'normal',
    rarity: 'rare',
    question: '파이리의 최종 진화형은?',
    options: ['리자드', '리자몽', '윈디', '마그마'],
    answer: 1,
    explanation: '파이리 → 리자드(Lv.16) → 리자몽(Lv.36) 순서로 진화합니다.',
    pokemon: { artworkId: 6, dexNo: 6, name: '리자몽', types: ['불꽃', '비행'] },
    item: { name: '불꽃의돌', description: '특정 포켓몬을 진화시키는 뜨거운 돌.' },
  },
  {
    id: 'q10',
    category: '포켓몬 진화',
    difficulty: 'normal',
    rarity: 'special',
    question: '윤겔라가 후딘으로 진화하는 방법은?',
    options: ['레벨업', '통신교환', '달의돌 사용', '친밀도 최대'],
    answer: 1,
    explanation: '윤겔라는 통신교환으로 후딘이 됩니다. (레전드 아르세우스에서는 연결의끈 사용)',
    pokemon: { artworkId: 65, dexNo: 65, name: '후딘', types: ['에스퍼'] },
    item: { name: '연결의끈', description: '통신교환 진화를 대신해 주는 신비한 끈.' },
  },
  {
    id: 'q11',
    category: '포켓몬 기술',
    difficulty: 'normal',
    rarity: 'rare',
    question: '전기 타입 대표 기술 "10만볼트"의 위력은? (6세대 이후 기준)',
    options: ['80', '90', '110', '120'],
    answer: 1,
    explanation: '10만볼트는 5세대까지 위력 95였고, 6세대부터 90이 되었습니다.',
    pokemon: { artworkId: 26, dexNo: 26, name: '라이츄', types: ['전기'] },
    item: { name: '기술머신', description: '포켓몬에게 기술을 가르칠 수 있는 머신.' },
  },
  {
    id: 'q12',
    category: '포켓몬 기술',
    difficulty: 'normal',
    rarity: 'special',
    question: '기술 "지진"의 타입은?',
    options: ['바위', '격투', '땅', '강철'],
    answer: 2,
    explanation: '지진은 위력 100의 땅 타입 물리 기술로, 주변의 모든 포켓몬을 공격합니다.',
    pokemon: { artworkId: 445, dexNo: 445, name: '한카리아스', types: ['드래곤', '땅'] },
    item: { name: '부드러운모래', description: '지니게 하면 땅 타입 기술의 위력이 올라간다.' },
  },
  {
    id: 'q13',
    category: '특성',
    difficulty: 'normal',
    rarity: 'rare',
    question: '갸라도스가 배틀에 나왔을 때 상대의 공격을 1랭크 떨어뜨리는 특성은?',
    options: ['위협', '자기과신', '심술', '플러스'],
    answer: 0,
    explanation: '위협은 등장 시 상대 포켓몬의 공격을 떨어뜨리는 특성입니다.',
    pokemon: { artworkId: 130, dexNo: 130, name: '갸라도스', types: ['물', '비행'] },
    item: { name: '신비의물방울', description: '지니게 하면 물 타입 기술의 위력이 올라간다.' },
  },
  {
    id: 'q14',
    category: '특성',
    difficulty: 'normal',
    rarity: 'special',
    question: '특성 "부유"를 가질 수 있어 땅 타입 기술을 맞지 않는 포켓몬은?',
    options: ['딱구리', '또가스', '디그다', '코일'],
    answer: 1,
    explanation: '또가스는 특성 "부유"로 공중에 떠 있어 땅 타입 기술이 통하지 않습니다.',
    pokemon: { artworkId: 109, dexNo: 109, name: '또가스', types: ['독'] },
    item: { name: '풍선', description: '지니고 있는 동안 땅 타입 기술을 맞지 않는다.' },
  },
  {
    id: 'q15',
    category: '폼 체인지',
    difficulty: 'normal',
    rarity: 'special',
    question: '로토무가 히트로토무, 워시로토무 등으로 폼 체인지하는 방법은?',
    options: ['특정 기술 사용', '가전제품 안으로 들어간다', '날씨가 바뀐다', '전용 플레이트를 지닌다'],
    answer: 1,
    explanation: '로토무는 전자레인지, 세탁기, 냉장고, 선풍기, 잔디깎기 안에 들어가 폼 체인지합니다.',
    pokemon: { artworkId: 479, dexNo: 479, name: '로토무', types: ['전기', '고스트'] },
    item: { name: '로토무카탈로그', description: '로토무를 가전제품에 들여보내 폼을 바꾸는 카탈로그.' },
  },
  {
    id: 'q16',
    category: '포켓몬 진화',
    difficulty: 'normal',
    rarity: 'rare',
    question: '잉어킹은 몇 레벨에 갸라도스로 진화할까?',
    options: ['15', '20', '25', '30'],
    answer: 1,
    explanation: '약하기로 유명한 잉어킹은 레벨 20이 되면 강력한 갸라도스로 진화합니다.',
    pokemon: { artworkId: 129, dexNo: 129, name: '잉어킹', types: ['물'] },
    item: { name: '이상한사탕', description: '포켓몬의 레벨을 1 올려 주는 사탕.' },
  },
  {
    id: 'q17',
    category: '전용 기술·아이템',
    difficulty: 'normal',
    rarity: 'special',
    question: '메타몽이 배울 수 있는 유일한 기술은?',
    options: ['흉내내기', '따라하기', '변신', '바꿔치기'],
    answer: 2,
    explanation: '메타몽은 "변신"만 배우며, 전용 아이템 "메탈파우더"를 지니면 방어가 오릅니다.',
    pokemon: { artworkId: 132, dexNo: 132, name: '메타몽', types: ['노말'] },
    item: { name: '메탈파우더', description: '메타몽 전용 아이템. 지니게 하면 방어가 올라간다.' },
  },
  {
    id: 'q18',
    category: '전설의 포켓몬',
    difficulty: 'hard',
    rarity: 'legendary',
    question: '1996년 첫 포켓몬 게임 "적·녹"에 등장한, 유전자 조작으로 만들어진 전설의 포켓몬은?',
    options: ['뮤', '뮤츠', '루기아', '레쿠쟈'],
    answer: 1,
    explanation: '뮤츠는 뮤의 유전자를 재조합하여 만들어진 전설의 포켓몬입니다.',
    pokemon: { artworkId: 150, dexNo: 150, name: '뮤츠', types: ['에스퍼'] },
    item: { name: '마스터볼', description: '야생 포켓몬을 반드시 잡을 수 있는 최고 성능의 볼.' },
  },
  {
    id: 'q19',
    category: '환상의 포켓몬',
    difficulty: 'hard',
    rarity: 'mythical',
    question: '모든 포켓몬의 유전자를 가지고 있다고 알려진 환상의 포켓몬은?',
    options: ['세레비', '지라치', '뮤', '마나피'],
    answer: 2,
    explanation: '뮤는 모든 포켓몬의 유전자를 지녔다고 하며, 에메랄드에서는 "낡은해도"로 만날 수 있었습니다.',
    pokemon: { artworkId: 151, dexNo: 151, name: '뮤', types: ['에스퍼'] },
    item: { name: '낡은해도', description: '머나먼 고도로 향하는 길이 그려진 오래된 해도.' },
  },
  {
    id: 'q20',
    category: '메가진화',
    difficulty: 'hard',
    rarity: 'mega',
    question: '메가진화를 하려면 포켓몬은 메가스톤을, 트레이너는 무엇을 지녀야 할까?',
    options: ['Z링', '키스톤', '다이맥스밴드', '테라스탈오브'],
    answer: 1,
    explanation: '트레이너의 키스톤과 포켓몬의 메가스톤이 공명하면 메가진화가 일어납니다.',
    pokemon: { artworkId: 10059, dexNo: 448, name: '메가루카리오', types: ['격투', '강철'] },
    item: { name: '루카리오나이트', description: '루카리오를 메가진화시키는 메가스톤.' },
  },
  {
    id: 'q21',
    category: '메가진화',
    difficulty: 'hard',
    rarity: 'mega',
    question: '메가리자몽X의 타입은?',
    options: ['불꽃·비행', '불꽃·드래곤', '드래곤·비행', '불꽃·격투'],
    answer: 1,
    explanation: '메가리자몽X는 불꽃·드래곤, 메가리자몽Y는 불꽃·비행 타입입니다.',
    pokemon: { artworkId: 10034, dexNo: 6, name: '메가리자몽X', types: ['불꽃', '드래곤'] },
    item: { name: '리자몽나이트X', description: '리자몽을 메가리자몽X로 메가진화시키는 메가스톤.' },
  },
  {
    id: 'q22',
    category: '원시회귀',
    difficulty: 'hard',
    rarity: 'primal',
    question: '그란돈을 원시회귀시키기 위해 필요한 아이템은?',
    options: ['쪽빛구슬', '빨강구슬', '비취구슬', '금강옥'],
    answer: 1,
    explanation: '그란돈은 빨강구슬, 가이오가는 쪽빛구슬로 원시회귀합니다.',
    pokemon: { artworkId: 10078, dexNo: 383, name: '원시그란돈', types: ['땅', '불꽃'] },
    item: { name: '빨강구슬', description: '그란돈을 원시회귀시키는 붉게 빛나는 구슬.' },
  },
  {
    id: 'q23',
    category: '원시회귀',
    difficulty: 'hard',
    rarity: 'primal',
    question: '원시가이오가가 등장할 때 발동하는 특성은?',
    options: ['끝의대지', '델타스트림', '시작의바다', '잔비'],
    answer: 2,
    explanation: '시작의바다는 강한 비를 내려 불꽃 타입 공격 기술을 무효로 만듭니다.',
    pokemon: { artworkId: 10077, dexNo: 382, name: '원시가이오가', types: ['물'] },
    item: { name: '쪽빛구슬', description: '가이오가를 원시회귀시키는 푸르게 빛나는 구슬.' },
  },
  {
    id: 'q24',
    category: '울트라비스트',
    difficulty: 'hard',
    rarity: 'legendary',
    question: '울트라비스트 "텅비드(UB-01 기생)"의 타입은?',
    options: ['바위·독', '에스퍼·페어리', '고스트·독', '바위·에스퍼'],
    answer: 0,
    explanation: '텅비드는 울트라홀 너머에서 온 바위·독 타입 울트라비스트입니다.',
    pokemon: { artworkId: 793, dexNo: 793, name: '텅비드', types: ['바위', '독'] },
    item: { name: '울트라볼', description: '울트라비스트를 잡기 쉬운 특수한 볼.' },
  },
  {
    id: 'q25',
    category: '전용 기술·아이템',
    difficulty: 'hard',
    rarity: 'mythical',
    question: '아르세우스의 전용 기술은?',
    options: ['시간의포효', '공간절단', '심판의뭉치', '섀도다이브'],
    answer: 2,
    explanation: '심판의뭉치는 아르세우스가 지닌 플레이트에 따라 타입이 바뀌는 전용 기술입니다.',
    pokemon: { artworkId: 493, dexNo: 493, name: '아르세우스', types: ['노말'] },
    item: { name: '불구슬플레이트', description: '아르세우스를 불꽃 타입으로 바꾸는 신비한 석판.' },
  },
]

export function artworkUrl(artworkId: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${artworkId}.png`
}
