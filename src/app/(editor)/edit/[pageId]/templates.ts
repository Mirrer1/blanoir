import { Briefcase, FileText, Heart, type LucideIcon, Store, User } from 'lucide-react'
import { nanoid } from 'nanoid'

import type {
  ButtonSection,
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
      button('인스타그램', 'center'),
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
      image('rounded', 'wide'),
      paragraph('우리 가게를 소개하는 글을 적어보세요.'),
      title('메뉴'),
      gallery(),
      divider(),
      title('찾아오시는 길', 'medium'),
      paragraph('주소 / 영업시간 / 전화번호를 적어보세요.'),
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
      paragraph('결혼식에 초대합니다. 인사말을 적어보세요.', 'center'),
      divider(),
      title('예식 안내', 'medium', 'center'),
      paragraph('날짜 · 시간\n장소를 적어보세요.', 'center'),
      gallery(),
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
      paragraph('어떤 일을 하는지 한 줄로 소개하세요.'),
      title('작업물'),
      {
        id: nanoid(8),
        type: 'card',
        content: { cards: [] },
        style: { layout: 'grid', align: 'left' },
      },
      divider(),
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
      divider(),
      title('경력'),
      paragraph('회사 · 기간 · 한 일을 적어보세요.'),
      title('학력'),
      paragraph('학교 · 전공 · 기간을 적어보세요.'),
      title('스킬'),
      paragraph('보유 기술을 적어보세요.'),
    ],
  },
]
