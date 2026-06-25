import { describe, expect, it } from 'vitest'

import { firstImageUrl, firstParagraphText, firstTextContent } from './pageMeta'
import type {
  CardSection,
  GallerySection,
  ImageSection,
  ParagraphSection,
  Section,
  TitleSection,
} from '@/types/section'

const textStyle = {
  size: 'medium',
  color: '',
  align: 'left',
  bold: false,
  italic: false,
  font: '',
} as const

const title = (text: string): TitleSection => ({
  id: 't',
  type: 'title',
  content: { text },
  style: textStyle,
})

const paragraph = (text: string): ParagraphSection => ({
  id: 'p',
  type: 'paragraph',
  content: { text },
  style: textStyle,
})

const image = (src: string): ImageSection => ({
  id: 'i',
  type: 'image',
  content: { src, alt: '' },
  style: {
    size: 'medium',
    shape: 'square',
    align: 'center',
    ratio: 'original',
    zoom: 1,
    focusX: 50,
    focusY: 50,
  },
})

const gallery = (urls: string[]): GallerySection => ({
  id: 'g',
  type: 'gallery',
  content: { images: urls.map((url) => ({ url, alt: '' })) },
  style: { displayMode: 'grid', shape: 'square', gap: 'small' },
})

const card = (images: string[]): CardSection => ({
  id: 'c',
  type: 'card',
  content: {
    cards: images.map((img, idx) => ({
      id: `card-${idx}`,
      image: img,
      alt: '',
      title: '',
      description: '',
    })),
  },
  style: { layout: 'grid', align: 'center' },
})

describe('firstParagraphText', () => {
  it('첫 문단 텍스트를 150자까지 자름', () => {
    const sections: Section[] = [title('제목'), paragraph('본문 내용')]
    expect(firstParagraphText(sections)).toBe('본문 내용')
  })

  it('내용이 공백뿐인 문단은 건너뜀', () => {
    const sections: Section[] = [paragraph('   '), paragraph('진짜 본문')]
    expect(firstParagraphText(sections)).toBe('진짜 본문')
  })

  it('문단이 없으면 빈 문자열', () => {
    expect(firstParagraphText([title('제목만')])).toBe('')
  })

  it('150자를 초과하면 자름', () => {
    const long = 'a'.repeat(200)
    expect(firstParagraphText([paragraph(long)])).toHaveLength(150)
  })
})

describe('firstTextContent', () => {
  it('제목이든 문단이든 첫 텍스트를 80자까지 가져옴', () => {
    expect(firstTextContent([title('제목 텍스트')])).toBe('제목 텍스트')
  })

  it('빈 캔버스면 빈 문자열', () => {
    expect(firstTextContent([image('http://x/a.jpg')])).toBe('')
  })
})

describe('firstImageUrl', () => {
  it('이미지 섹션의 src를 찾음', () => {
    expect(firstImageUrl([title('t'), image('http://x/a.jpg')])).toBe('http://x/a.jpg')
  })

  it('갤러리 첫 이미지를 찾음', () => {
    expect(firstImageUrl([gallery(['http://x/g1.jpg', 'http://x/g2.jpg'])])).toBe('http://x/g1.jpg')
  })

  it('카드에서 이미지가 있는 첫 카드를 찾음', () => {
    expect(firstImageUrl([card(['', 'http://x/c2.jpg'])])).toBe('http://x/c2.jpg')
  })

  it('앞선 섹션을 우선', () => {
    expect(firstImageUrl([image('http://x/first.jpg'), gallery(['http://x/g.jpg'])])).toBe(
      'http://x/first.jpg',
    )
  })

  it('이미지가 없으면 빈 문자열', () => {
    expect(firstImageUrl([title('t'), gallery([])])).toBe('')
  })
})
