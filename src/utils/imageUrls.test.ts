import { describe, expect, it } from 'vitest'

import { sectionImageUrls } from './imageUrls'
import type { CardSection, GallerySection, ImageSection, TitleSection } from '@/types/section'

const image: ImageSection = {
  id: 'i',
  type: 'image',
  content: { src: 'http://x/a.jpg', alt: '' },
  style: {
    size: 'medium',
    shape: 'square',
    align: 'center',
    ratio: 'original',
    zoom: 1,
    focusX: 50,
    focusY: 50,
  },
}

const gallery: GallerySection = {
  id: 'g',
  type: 'gallery',
  content: {
    images: [
      { url: 'http://x/g1.jpg', alt: '' },
      { url: '', alt: '' },
      { url: 'http://x/g2.jpg', alt: '' },
    ],
  },
  style: { displayMode: 'grid', shape: 'square', gap: 'small' },
}

const card: CardSection = {
  id: 'c',
  type: 'card',
  content: {
    cards: [
      { id: '1', image: 'http://x/c1.jpg', alt: '', title: '', description: '' },
      { id: '2', image: '', alt: '', title: '', description: '' },
    ],
  },
  style: { layout: 'grid', align: 'center' },
}

const title: TitleSection = {
  id: 't',
  type: 'title',
  content: { text: 'hi' },
  style: { size: 'large', color: '', align: 'center', bold: false, italic: false, font: '' },
}

describe('sectionImageUrls', () => {
  it('이미지 섹션의 src를 모음', () => {
    expect(sectionImageUrls(image)).toEqual(['http://x/a.jpg'])
  })

  it('갤러리는 비어있지 않은 url만 모음', () => {
    expect(sectionImageUrls(gallery)).toEqual(['http://x/g1.jpg', 'http://x/g2.jpg'])
  })

  it('카드는 이미지가 있는 카드만 모음', () => {
    expect(sectionImageUrls(card)).toEqual(['http://x/c1.jpg'])
  })

  it('컨테이너 배경 이미지를 포함하고 맨 앞에 둠', () => {
    const withBg = { ...image, container: { backgroundImage: 'http://x/bg.jpg' } }
    expect(sectionImageUrls(withBg)).toEqual(['http://x/bg.jpg', 'http://x/a.jpg'])
  })

  it('이미지가 없는 섹션은 빈 배열', () => {
    expect(sectionImageUrls(title)).toEqual([])
  })
})
