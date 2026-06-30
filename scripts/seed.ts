// 개발용 더미데이터 시드
// 실행 때마다 기존 test{N} 다음 번호로 유저와 페이지를 만들고 게시글에 이미지는 미포함
// npm run seed 명령어로 실행
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import { nanoid } from 'nanoid'

import { connectDB } from '@/lib/mongoDB'
import Page from '@/models/Page'
import User from '@/models/User'
import type { Section, TextAlign } from '@/types/section'
import { generateHandle } from '@/utils/handle'

const USERS_PER_RUN = 5 // 한 번에 추가할 유저 수
const PASSWORD = '11111111'
const PAGES_MIN = 5
const PAGES_MAX = 10

const randInt = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1))
const pick = <T>(items: T[]): T => items[randInt(0, items.length - 1)]

// 섹션 팩토리
const title = (
  text: string,
  size: 'large' | 'xlarge' = 'xlarge',
  align: TextAlign = 'center',
): Section => ({
  id: nanoid(8),
  type: 'title',
  content: { text },
  style: { size, color: '', align, bold: true, italic: false, font: 'pretendard' },
})

const paragraph = (text: string, align: TextAlign = 'left'): Section => ({
  id: nanoid(8),
  type: 'paragraph',
  content: { text },
  style: { size: 'medium', color: '', align, bold: false, italic: false, font: 'pretendard' },
})

const divider = (variant: 'solid' | 'dashed' | 'dotted' = 'solid'): Section => ({
  id: nanoid(8),
  type: 'divider',
  content: {},
  style: { variant, thickness: 'thin', color: '' },
})

const spacer = (size: 'small' | 'medium' | 'large' = 'medium'): Section => ({
  id: nanoid(8),
  type: 'spacer',
  content: {},
  style: { size },
})

const button = (text: string, width: 'auto' | 'wide' | 'full' = 'auto'): Section => ({
  id: nanoid(8),
  type: 'button',
  content: { text, url: 'https://example.com' },
  style: { color: '', textColor: '', shape: 'rounded', size: 'medium', width, align: 'center' },
})

// 유형별 페이지 빌더
type PageKind = { title: string; build: () => Section[] }

const PAGE_KINDS: PageKind[] = [
  {
    title: '소개합니다',
    build: () => [
      title('안녕하세요, 반갑습니다'),
      divider(),
      paragraph(
        '일상의 작은 순간을 기록하는 걸 좋아합니다. 이 페이지에서 제 이야기를 가볍게 풀어보려 합니다.',
      ),
      paragraph(
        '아침에는 주로 책을 읽고, 낮에는 일을 하고, 밤에는 그날 있었던 일을 짧게 적습니다. 별다를 것 없는 하루지만 그 안에서 좋아하는 것들을 하나씩 발견하는 게 즐겁습니다.',
      ),
      paragraph(
        '사진 찍기, 오래된 카페 찾아다니기, 손편지 쓰기를 좋아합니다. 느리지만 꾸준히 모아가는 중이에요.',
      ),
      spacer('small'),
      paragraph('궁금한 점이 있다면 언제든 편하게 인사 남겨주세요. 답장은 느려도 꼭 드립니다.'),
      button('인사 남기기'),
    ],
  },
  {
    title: '링크 모음',
    build: () => [
      title('제 모든 링크', 'large'),
      paragraph(
        '자주 쓰는 채널을 한곳에 모았습니다. 관심 있는 곳으로 편하게 들어와 주세요.',
        'center',
      ),
      spacer('small'),
      button('블로그 보기', 'full'),
      button('인스타그램', 'full'),
      button('유튜브 채널', 'full'),
      button('뉴스레터 구독', 'full'),
      button('메일 보내기', 'full'),
      spacer('small'),
      paragraph('협업이나 제안은 메일로 주시면 가장 빠르게 확인합니다.', 'center'),
    ],
  },
  {
    title: '공지사항',
    build: () => [
      title('잠깐 안내드립니다', 'large', 'left'),
      paragraph('이번 주는 개인 사정으로 운영을 잠시 쉬어갑니다. 미리 알려드리지 못해 죄송합니다.'),
      paragraph(
        '다음 주 월요일부터는 평소처럼 정상 운영합니다. 그동안 남겨주신 문의는 돌아오는 대로 순서대로 답변드리겠습니다.',
      ),
      divider('dashed'),
      paragraph(
        '급한 용건은 메일로 보내주시면 확인 즉시 회신하겠습니다. 기다려 주셔서 늘 감사합니다.',
      ),
    ],
  },
  {
    title: '오늘의 기록',
    build: () => [
      title('생각을 적어둡니다', 'large', 'left'),
      paragraph(
        '머릿속을 스쳐 간 것들을 잊기 전에 적어두는 공간입니다. 정리되지 않아도 일단 남겨봅니다.',
      ),
      paragraph(
        '오늘은 길을 걷다 오래된 골목의 노을을 봤습니다. 별것 아닌 풍경인데 한참을 서서 바라봤어요. 돌아보면 이런 사소한 장면이 가장 오래 남는 것 같습니다.',
      ),
      spacer('medium'),
      paragraph(
        '요즘은 매일 한 문장이라도 쓰자는 마음으로 지냅니다. 잘 쓰려는 욕심을 내려놓으니 오히려 꾸준해지더라고요.',
      ),
      paragraph('비슷한 결을 좋아하신다면 가끔 들러주세요. 댓글은 못 달지만 다 읽고 있습니다.'),
    ],
  },
  {
    title: '작은 가게 안내',
    build: () => [
      title('동네 끝, 작은 가게'),
      paragraph(
        '매일 아침 직접 내린 커피와 그날 구운 빵을 준비합니다. 천천히 머물다 가기 좋은 자리를 마련했어요.',
        'center',
      ),
      paragraph(
        '계절마다 메뉴가 조금씩 바뀝니다. 요즘은 자두를 올린 타르트와 진한 아메리카노가 잘 나갑니다.',
        'center',
      ),
      divider('dashed'),
      paragraph('영업시간 · 화요일부터 일요일까지 / 오전 10시 ~ 저녁 7시', 'center'),
      paragraph('월요일은 정기 휴무입니다. 예약과 단체 문의는 전화로 부탁드려요.', 'center'),
      button('오시는 길'),
    ],
  },
  {
    title: '포트폴리오',
    build: () => [
      title('만든 것들을 모았습니다'),
      divider(),
      paragraph(
        '지난 몇 해 동안 진행한 작업을 정리했습니다. 각 프로젝트마다 어떤 문제를 어떻게 풀었는지 짧게 덧붙였어요.',
      ),
      paragraph(
        '웹사이트, 브랜드 아이덴티티, 작은 앱까지 분야를 가리지 않고 다뤘습니다. 디자인부터 구현까지 직접 손대는 걸 좋아합니다.',
      ),
      paragraph(
        '결과물보다 과정을 더 오래 들여다보는 편입니다. 왜 이렇게 만들었는지 설명할 수 있는 작업을 지향합니다.',
      ),
      spacer('small'),
      paragraph('함께할 일이 있다면 가볍게 연락 주세요. 작은 프로젝트도 환영합니다.'),
      button('연락하기'),
    ],
  },
  {
    title: '자주 묻는 질문',
    build: () => [
      title('자주 묻는 질문', 'large'),
      divider('dotted'),
      paragraph('Q. 예약 없이 방문해도 되나요?'),
      paragraph(
        '네, 자리가 있으면 언제든 환영입니다. 다만 주말에는 대기가 있을 수 있어 단체는 미리 연락 주시면 좋아요.',
      ),
      spacer('small'),
      paragraph('Q. 주차가 가능한가요?'),
      paragraph(
        '건물 뒤편에 두 자리 마련되어 있습니다. 만차일 때는 도보 3분 거리의 공영주차장을 안내드려요.',
      ),
      spacer('small'),
      paragraph('Q. 반려동물과 함께 가도 되나요?'),
      paragraph('야외 테라스 자리에 한해 가능합니다. 실내는 어렵다는 점 양해 부탁드려요.'),
    ],
  },
  {
    title: '초대합니다',
    build: () => [
      title('우리, 결혼합니다'),
      paragraph(
        '서로를 마주한 지 어느덧 여러 계절이 지났습니다. 이제 같은 곳을 바라보며 한 걸음을 내딛으려 합니다.',
        'center',
      ),
      paragraph(
        '변함없이 곁을 지켜준 분들 앞에서 약속을 나누고자 합니다. 귀한 걸음으로 축복해 주시면 더없는 기쁨이겠습니다.',
        'center',
      ),
      divider(),
      paragraph('2026년 가을, 작은 정원에서', 'center'),
      paragraph('자세한 날짜와 장소는 아래에서 확인해 주세요.', 'center'),
      button('예식 안내'),
    ],
  },
  {
    title: '여행 기록',
    build: () => [
      title('한 달간의 남쪽 여행', 'large'),
      paragraph('계획 없이 떠난 여행이었습니다. 기차표만 끊고 나머지는 그날의 기분에 맡겼어요.'),
      paragraph(
        '바다를 낀 작은 마을에서 가장 오래 머물렀습니다. 아침마다 같은 식당에서 백반을 먹고, 낮에는 방파제에 앉아 책을 읽었습니다.',
      ),
      divider('dotted'),
      paragraph(
        '여행에서 돌아오니 무언가 정리된 기분이었습니다. 멀리 가야만 보이는 것들이 있더라고요.',
      ),
      spacer('small'),
      paragraph('다음 여행지를 고민 중입니다. 추천이 있다면 살짝 알려주세요.'),
      button('여행 사진 보기'),
    ],
  },
  {
    title: '오늘의 레시피',
    build: () => [
      title('집에서 만드는 들기름 막국수'),
      paragraph(
        '재료만 준비되면 십 분이면 완성되는 여름 별미입니다. 입맛 없는 날에 특히 좋아요.',
        'center',
      ),
      divider('dashed'),
      paragraph('재료 · 메밀면 한 줌, 들기름 두 스푼, 김가루, 통깨, 간장 약간'),
      paragraph('1. 면을 삶아 찬물에 헹궈 물기를 뺍니다.'),
      paragraph('2. 들기름과 간장을 둘러 면에 고루 버무립니다.'),
      paragraph('3. 김가루와 통깨를 듬뿍 올리면 끝입니다.'),
      spacer('small'),
      paragraph('취향에 따라 달걀노른자를 얹어도 좋습니다. 비비면 한층 고소해져요.'),
    ],
  },
  {
    title: '이번 달 독서',
    build: () => [
      title('읽은 책을 적어둡니다', 'large', 'left'),
      paragraph('한 달에 몇 권을 읽었는지보다, 어떤 문장이 남았는지를 기록하려 합니다.'),
      divider(),
      paragraph(
        '밑줄 그은 문장은 멀리 가기 위해서가 아니라 깊이 머물기 위해 읽는다는 구절이었습니다. 요즘의 저에게 꼭 필요한 말이었어요.',
      ),
      paragraph('소설 두 권과 에세이 한 권을 읽었습니다. 그중 한 권은 이미 두 번째 읽는 중입니다.'),
      spacer('medium'),
      paragraph('다음 달에는 오래 미뤄둔 두꺼운 책에 도전해 보려 합니다.'),
    ],
  },
  {
    title: '작업실 소식',
    build: () => [
      title('작은 작업실을 엽니다'),
      paragraph(
        '오래 준비한 공간을 드디어 열게 되었습니다. 직접 만든 그릇과 소품을 두고 작업도 이어가는 곳입니다.',
        'center',
      ),
      divider(),
      paragraph(
        '매주 토요일에는 원데이 클래스를 진행합니다. 흙을 처음 만져보는 분도 부담 없이 오실 수 있어요.',
      ),
      paragraph('정해진 결과물을 만들기보다, 손으로 무언가를 빚는 시간 자체를 즐기시길 바랍니다.'),
      spacer('small'),
      paragraph('신청은 아래 버튼으로 받습니다. 자리가 많지 않아 미리 알려드려요.'),
      button('클래스 신청'),
    ],
  },
  {
    title: '운동 일지',
    build: () => [
      title('100일 달리기 기록', 'large', 'left'),
      paragraph('숨이 차서 오 분도 못 뛰던 사람이 어느새 삼십 분을 달리게 되었습니다.'),
      paragraph(
        '빠르게 달리는 게 목표가 아니었습니다. 그저 매일 같은 시간에 신발을 신고 나가는 일을 지키고 싶었어요.',
      ),
      divider('dotted'),
      paragraph(
        '비 오는 날엔 우산을 쓰고 걸었고, 너무 추운 날엔 집에서 제자리 뛰기라도 했습니다. 거른 날은 손에 꼽습니다.',
      ),
      spacer('small'),
      paragraph('다음 목표는 십 킬로미터입니다. 무리하지 않고 천천히 늘려가려 합니다.'),
      button('기록 함께 보기'),
    ],
  },
  {
    title: '감사 인사',
    build: () => [
      title('함께해 주셔서 고맙습니다'),
      paragraph(
        '작게 시작한 일이 어느새 일 년을 넘겼습니다. 모두 곁에서 지켜봐 주신 덕분입니다.',
        'center',
      ),
      divider(),
      paragraph(
        '부족한 점이 많았는데도 너그럽게 기다려 주셔서 여기까지 올 수 있었습니다. 받은 마음을 잊지 않겠습니다.',
        'center',
      ),
      paragraph(
        '앞으로도 서두르지 않고 한 걸음씩 나아가겠습니다. 변함없이 지켜봐 주세요.',
        'center',
      ),
      button('소식 받아보기'),
    ],
  },
]

// 기존 test{N} 다음 시작 번호
async function nextStartNumber() {
  const users = await User.find({ email: /^test\d+@gmail\.com$/ })
    .select('email')
    .lean<{ email: string }[]>()
  const max = users.reduce((acc, user) => {
    const num = Number(user.email.match(/^test(\d+)@gmail\.com$/)?.[1] ?? 0)
    return Math.max(acc, num)
  }, 0)
  return max + 1
}

async function seed() {
  await connectDB()
  const hashedPassword = await bcrypt.hash(PASSWORD, 10)
  const start = await nextStartNumber()

  let createdUsers = 0
  let createdPages = 0

  for (let i = 0; i < USERS_PER_RUN; i += 1) {
    const num = start + i
    const email = `test${num}@gmail.com`
    const name = `test${num}`

    // handle 충돌 시 접미사
    const base = generateHandle(name)
    let handle = base
    let suffix = 2
    while (await User.exists({ handle })) {
      handle = `${base}_${suffix}`
      suffix += 1
    }

    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      handle,
      provider: 'local',
    })
    createdUsers += 1

    const pageCount = randInt(PAGES_MIN, PAGES_MAX)
    for (let p = 0; p < pageCount; p += 1) {
      const kind = pick(PAGE_KINDS)
      await Page.create({
        pageId: nanoid(10),
        userId: user._id,
        title: kind.title,
        sections: kind.build(),
        isPublic: true,
      })
      createdPages += 1
    }
  }

  console.log(
    `유저 ${createdUsers}명 (test${start}~test${start + USERS_PER_RUN - 1}) · 페이지 ${createdPages}개 생성`,
  )
  await mongoose.disconnect()
}

seed().catch((error) => {
  console.error('seed failed', error)
  process.exit(1)
})
