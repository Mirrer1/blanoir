import { Briefcase, FileText, Heart, type LucideIcon, Store, User } from 'lucide-react'
import { nanoid } from 'nanoid'

import type {
  ButtonSection,
  CardSection,
  ColumnChild,
  ColumnsSection,
  DividerSection,
  GallerySection,
  ImageSection,
  ParagraphSection,
  Section,
  TextAlign,
  TextSize,
  TitleSection,
} from '@/types/section'

// 템플릿 섹션 빌더
const title = (
  text: string,
  size: TextSize = 'large',
  align: TextAlign = 'left',
): TitleSection => ({
  id: nanoid(8),
  type: 'title',
  content: { text },
  style: { size, color: '', align, bold: true, italic: false, font: 'pretendard' },
})

const paragraph = (text: string, align: TextAlign = 'left'): ParagraphSection => ({
  id: nanoid(8),
  type: 'paragraph',
  content: { text },
  style: { size: 'medium', color: '', align, bold: false, italic: false, font: 'pretendard' },
})

const button = (text: string, align: TextAlign = 'left'): ButtonSection => ({
  id: nanoid(8),
  type: 'button',
  content: { text, url: '' },
  style: { color: '', textColor: '', shape: 'rounded', size: 'medium', width: 'auto', align },
})

const divider = (): DividerSection => ({
  id: nanoid(8),
  type: 'divider',
  content: {},
  style: { variant: 'solid', thickness: 'thin', color: '' },
})

const image = (
  shape: ImageSection['style']['shape'] = 'rounded',
  ratio: ImageSection['style']['ratio'] = 'original',
): ImageSection => ({
  id: nanoid(8),
  type: 'image',
  content: { src: '', alt: '' },
  style: { size: 'large', shape, align: 'center', ratio, zoom: 1, focusX: 50, focusY: 50 },
})

const gallery = (): GallerySection => ({
  id: nanoid(8),
  type: 'gallery',
  content: { images: [] },
  style: { displayMode: 'grid', shape: 'rounded', gap: 'medium' },
})

const card = (layout: CardSection['style']['layout'] = 'grid'): CardSection => ({
  id: nanoid(8),
  type: 'card',
  content: { cards: [] },
  style: { layout, align: 'left' },
})

// 칸마다 블록 하나, 6칸 그리드 균등 분할
const columns = (children: ColumnChild[]): ColumnsSection => ({
  id: nanoid(8),
  type: 'columns',
  content: { columns: children.map((child) => [child]) },
  style: { widths: children.map(() => 6 / children.length) },
})

export interface EditorTemplate {
  id: string
  label: string
  description: string
  icon: LucideIcon
  build: () => Section[]
}

export const EDITOR_TEMPLATES: EditorTemplate[] = [
  {
    id: 'profile',
    label: '프로필',
    description: '나를 소개하는 개인 홈',
    icon: User,
    build: () => [
      title('이름을 입력하세요', 'xlarge', 'center'),
      image('circle'),
      paragraph('나를 한 줄로 소개하는 문장을 적어보세요.', 'center'),
      divider(),
      title('소개', 'large', 'center'),
      paragraph('어떤 일을 하고 무엇에 관심이 있는지 자유롭게 적어보세요.', 'center'),
      title('링크', 'large', 'center'),
      button('인스타그램', 'center'),
      button('유튜브채널', 'center'),
      button('이메일문의', 'center'),
    ],
  },
  {
    id: 'store',
    label: '매장',
    description: '카페·식당·가게 영업 정보',
    icon: Store,
    build: () => [
      title('가게 이름', 'xlarge'),
      paragraph('한 줄 슬로건이나 콘셉트를 적어보세요.'),
      image('rounded', 'wide'),
      title('소개'),
      paragraph('우리 가게가 어떤 곳인지, 무엇이 특별한지 적어보세요.'),
      divider(),
      title('메뉴'),
      paragraph('대표 메뉴와 가격을 적어보세요.'),
      gallery(),
      divider(),
      title('찾아오시는 길'),
      paragraph('주소\n영업시간\n전화번호'),
      columns([button('전화하기', 'center'), button('지도보기', 'center')]),
    ],
  },
  {
    id: 'wedding',
    label: '청첩장',
    description: '결혼식 인사말과 예식 안내',
    icon: Heart,
    build: () => [
      title('신랑 ♥ 신부', 'xlarge', 'center'),
      image(),
      paragraph('두 사람이 하나가 됩니다.\n소중한 분들을 초대합니다.', 'center'),
      divider(),
      title('인사말', 'large', 'center'),
      paragraph('결혼식에 초대하는 인사말을 적어보세요.', 'center'),
      title('예식 안내', 'large', 'center'),
      paragraph('날짜 · 요일 · 시간\n예식장 이름 · 홀', 'center'),
      title('사진', 'large', 'center'),
      gallery(),
      divider(),
      title('마음 전하실 곳', 'large', 'center'),
      columns([
        paragraph('신랑 측\n예금주 · 계좌번호', 'center'),
        paragraph('신부 측\n예금주 · 계좌번호', 'center'),
      ]),
      button('오시는 길', 'center'),
    ],
  },
  {
    id: 'portfolio',
    label: '포트폴리오',
    description: '작업물·프로젝트를 카드로 전시',
    icon: Briefcase,
    build: () => [
      title('포트폴리오', 'xlarge'),
      paragraph('어떤 일을 하는지, 어떤 강점이 있는지 한두 줄로 소개하세요.'),
      divider(),
      title('소개'),
      columns([image('rounded'), paragraph('경력이나 전문 분야를 간단히 적어보세요.')]),
      title('작업물'),
      card('grid'),
      divider(),
      title('연락처'),
      paragraph('이메일이나 SNS를 적어보세요.'),
      button('연락하기'),
    ],
  },
  {
    id: 'resume',
    label: '이력서',
    description: '경력·학력·스킬을 글로 정리',
    icon: FileText,
    build: () => [
      title('이름', 'xlarge'),
      paragraph('직무 / 한 줄 소개'),
      paragraph('이메일 · 전화번호 · 거주지'),
      divider(),
      title('소개'),
      paragraph('나를 소개하는 짧은 글을 적어보세요.'),
      title('경력'),
      paragraph('회사 · 직책 · 기간\n맡은 업무와 성과를 적어보세요.'),
      title('학력'),
      paragraph('학교 · 전공 · 기간을 적어보세요.'),
      title('스킬'),
      paragraph('보유 기술과 자격증을 적어보세요.'),
      title('프로젝트'),
      paragraph('주요 프로젝트와 역할을 적어보세요.'),
    ],
  },
]
