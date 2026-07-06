import { describe, expect, it } from 'vitest'

import { cloneSections, remapImageUrls } from './sectionClone'
import type {
  CardSection,
  ColumnsSection,
  ContainerStyle,
  GallerySection,
  ImageSection,
  Section,
  TitleSection,
} from '@/types/section'

const IMAGE_STYLE = {
  size: 'medium',
  shape: 'square',
  align: 'center',
  ratio: 'original',
  zoom: 1,
  focusX: 50,
  focusY: 50,
} as const

const TEXT_STYLE = {
  size: 'medium',
  color: '',
  align: 'left',
  bold: false,
  italic: false,
  font: 'pretendard',
} as const

const image = (id: string, src: string): ImageSection => ({
  id,
  type: 'image',
  content: { src, alt: '' },
  style: IMAGE_STYLE,
})

const title = (id: string, text = ''): TitleSection => ({
  id,
  type: 'title',
  content: { text },
  style: TEXT_STYLE,
})

const columns = (cols: ColumnsSection['content']['columns']): ColumnsSection => ({
  id: 'col',
  type: 'columns',
  content: { columns: cols },
  style: { widths: cols.map(() => 6 / cols.length) },
})

describe('cloneSections', () => {
  it('각 섹션에 원본과 다른 새 id를 부여', () => {
    const cloned = cloneSections([title('a'), title('b')])
    expect(cloned[0].id).not.toBe('a')
    expect(cloned[1].id).not.toBe('b')
    expect(cloned[0].id).not.toBe(cloned[1].id)
  })

  it('열 칸 자식에도 새 id를 부여', () => {
    const cloned = cloneSections([columns([[image('ci', 'a.jpg')], []])])
    const child = (cloned[0] as ColumnsSection).content.columns[0][0]
    expect(child.id).not.toBe('ci')
  })

  it('깊은 복제라 복제본 수정이 원본에 영향 없음', () => {
    const original = [title('a', '원본')]
    const cloned = cloneSections(original)
    ;(cloned[0] as TitleSection).content.text = '수정'
    expect((original[0] as TitleSection).content.text).toBe('원본')
  })
})

describe('remapImageUrls', () => {
  it('이미지 src를 새 URL로 교체', () => {
    const sections: Section[] = [image('img', 'old.jpg')]
    remapImageUrls(sections, new Map([['old.jpg', 'new.jpg']]))
    expect((sections[0] as ImageSection).content.src).toBe('new.jpg')
  })

  it('갤러리와 컨테이너 배경을 교체', () => {
    const gallery: GallerySection & { container?: ContainerStyle } = {
      id: 'g',
      type: 'gallery',
      content: { images: [{ url: 'g-old.jpg', alt: '' }] },
      style: { displayMode: 'grid', shape: 'square', gap: 'small' },
      container: { backgroundImage: 'bg-old.jpg' },
    }
    remapImageUrls(
      [gallery],
      new Map([
        ['g-old.jpg', 'g-new.jpg'],
        ['bg-old.jpg', 'bg-new.jpg'],
      ]),
    )
    expect(gallery.content.images[0].url).toBe('g-new.jpg')
    expect(gallery.container?.backgroundImage).toBe('bg-new.jpg')
  })

  it('카드 이미지를 교체', () => {
    const card: CardSection = {
      id: 'c',
      type: 'card',
      content: { cards: [{ id: '1', image: 'old.jpg', alt: '', title: '', description: '' }] },
      style: { layout: 'grid', align: 'left' },
    }
    remapImageUrls([card], new Map([['old.jpg', 'new.jpg']]))
    expect(card.content.cards[0].image).toBe('new.jpg')
  })

  it('열 칸 이미지를 교체', () => {
    const sections: Section[] = [columns([[image('ci', 'old.jpg')], []])]
    remapImageUrls(sections, new Map([['old.jpg', 'new.jpg']]))
    const child = (sections[0] as ColumnsSection).content.columns[0][0] as ImageSection
    expect(child.content.src).toBe('new.jpg')
  })

  it('맵에 없는 URL은 그대로 유지', () => {
    const sections: Section[] = [image('img', 'keep.jpg')]
    remapImageUrls(sections, new Map([['other.jpg', 'new.jpg']]))
    expect((sections[0] as ImageSection).content.src).toBe('keep.jpg')
  })
})
