import { describe, expect, it } from 'vitest'

import type { EditorStore } from './editor'
import { cloneSection, createEditorStore, findNode } from './editor'
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

const imageChild = (id: string, src: string): ImageSection => ({
  id,
  type: 'image',
  content: { src, alt: '' },
  style: IMAGE_STYLE,
})

const TEXT_STYLE = {
  size: 'medium',
  color: '',
  align: 'left',
  bold: false,
  italic: false,
  font: 'pretendard',
} as const

const titleChild = (id: string, text = ''): TitleSection => ({
  id,
  type: 'title',
  content: { text },
  style: TEXT_STYLE,
})

const columnsWith = (columns: ColumnsSection['content']['columns']): ColumnsSection => ({
  id: 'col',
  type: 'columns',
  content: { columns },
  style: { widths: columns.map(() => 6 / columns.length) },
})

const makeStore = (sections: Section[] = []) =>
  createEditorStore({
    pageId: 'p1',
    handle: 'h',
    title: 't',
    isPublic: false,
    sections,
    myPages: [],
  })

// 스토어에서 columns 섹션을 타입 좁혀 꺼냄
const columnsOf = (store: EditorStore): ColumnsSection => {
  const found = store.getState().sections.find((s) => s.type === 'columns')
  if (!found || found.type !== 'columns') {
    throw new Error('columns 섹션 없음')
  }
  return found
}

describe('findNode', () => {
  it('top-level 섹션을 id로 찾음', () => {
    const section = titleChild('t1', '제목')
    expect(findNode([section], 't1')).toBe(section)
  })

  it('열 칸 자식을 id로 찾음', () => {
    const child = titleChild('c1')
    const section = columnsWith([[child], []])
    expect(findNode([section], 'c1')).toBe(child)
  })

  it('없는 id면 null', () => {
    expect(findNode([columnsWith([[titleChild('c1')], []])], 'nope')).toBeNull()
  })

  it('id가 null이면 null', () => {
    expect(findNode([titleChild('t1')], null)).toBeNull()
  })
})

describe('addSection(columns)', () => {
  it('2열은 빈 칸 2개 + widths [3,3]', () => {
    const store = makeStore()
    store.getState().addSection('columns', undefined, 2)
    const col = columnsOf(store)
    expect(col.content.columns).toHaveLength(2)
    expect(col.content.columns.every((c) => c.length === 0)).toBe(true)
    expect(col.style.widths).toEqual([3, 3])
  })

  it('3열은 빈 칸 3개 + widths [2,2,2]', () => {
    const store = makeStore()
    store.getState().addSection('columns', undefined, 3)
    const col = columnsOf(store)
    expect(col.content.columns).toHaveLength(3)
    expect(col.style.widths).toEqual([2, 2, 2])
  })
})

describe('addColumnChild', () => {
  it('지정 칸에 블록 생성 후 그 블록 선택', () => {
    const store = makeStore()
    store.getState().addSection('columns', undefined, 2)
    const colId = columnsOf(store).id
    store.getState().addColumnChild(colId, 0, 'title')

    const col = columnsOf(store)
    expect(col.content.columns[0]).toHaveLength(1)
    expect(col.content.columns[0][0].type).toBe('title')
    expect(col.content.columns[1]).toHaveLength(0)
    expect(store.getState().selectedSectionId).toBe(col.content.columns[0][0].id)
  })
})

describe('updateSectionContent / updateSectionStyle (중첩)', () => {
  it('열 칸 자식의 콘텐츠를 id로 갱신', () => {
    const store = makeStore()
    store.getState().addSection('columns', undefined, 2)
    store.getState().addColumnChild(columnsOf(store).id, 0, 'title')
    const childId = columnsOf(store).content.columns[0][0].id

    store.getState().updateSectionContent(childId, { text: '안녕' })
    const child = columnsOf(store).content.columns[0][0]
    expect(child.type === 'title' && child.content.text).toBe('안녕')
  })

  it('열 칸 자식의 스타일을 id로 갱신', () => {
    const store = makeStore()
    store.getState().addSection('columns', undefined, 2)
    store.getState().addColumnChild(columnsOf(store).id, 0, 'title')
    const childId = columnsOf(store).content.columns[0][0].id

    store.getState().updateSectionStyle(childId, { align: 'center' })
    expect(columnsOf(store).content.columns[0][0].style.align).toBe('center')
  })
})

describe('removeColumnChild / restoreColumnChild', () => {
  it('칸을 비우고 선택 중이던 자식은 선택 해제', () => {
    const store = makeStore()
    store.getState().addSection('columns', undefined, 2)
    store.getState().addColumnChild(columnsOf(store).id, 0, 'title')
    const childId = columnsOf(store).content.columns[0][0].id

    store.getState().removeColumnChild(childId)
    expect(columnsOf(store).content.columns[0]).toHaveLength(0)
    expect(store.getState().selectedSectionId).toBeNull()
  })

  it('실행취소로 같은 칸에 자식 복원 후 선택', () => {
    const store = makeStore()
    store.getState().addSection('columns', undefined, 2)
    const colId = columnsOf(store).id
    const child = titleChild('back', '복원')

    store.getState().restoreColumnChild(colId, 1, child)
    const col = columnsOf(store)
    expect(col.content.columns[1]).toEqual([child])
    expect(store.getState().selectedSectionId).toBe('back')
  })
})

describe('setColumnWidths', () => {
  it('해당 열 섹션의 너비 비율 교체', () => {
    const store = makeStore()
    store.getState().addSection('columns', undefined, 2)
    const colId = columnsOf(store).id

    store.getState().setColumnWidths(colId, [4, 2])
    expect(columnsOf(store).style.widths).toEqual([4, 2])
  })
})

describe('moveColumn', () => {
  it('열을 from→to로 옮기며 내용·너비 함께 이동', () => {
    const store = makeStore()
    store.getState().addSection('columns', undefined, 3)
    const colId = columnsOf(store).id
    store.getState().addColumnChild(colId, 0, 'title')
    store.getState().setColumnWidths(colId, [3, 2, 1])
    const childId = columnsOf(store).content.columns[0][0].id

    store.getState().moveColumn(colId, 0, 2)
    const col = columnsOf(store)
    expect(col.content.columns[0]).toHaveLength(0)
    expect(col.content.columns[2][0].id).toBe(childId)
    expect(col.style.widths).toEqual([2, 1, 3])
  })
})

describe('cloneSection', () => {
  it('새 id를 발급하고 내용은 유지', () => {
    const clone = cloneSection(titleChild('orig', '제목'))
    expect(clone.id).not.toBe('orig')
    expect(clone.type).toBe('title')
    expect(clone.content).toEqual({ text: '제목' })
  })

  it('열 섹션은 칸 자식까지 새 id', () => {
    const clone = cloneSection(columnsWith([[titleChild('c1')], [titleChild('c2')]]))
    const cols = (clone as ColumnsSection).content.columns
    expect(clone.id).not.toBe('col')
    expect(cols[0][0].id).not.toBe('c1')
    expect(cols[1][0].id).not.toBe('c2')
  })

  it('깊은 복제라 원본과 분리됨', () => {
    const original = titleChild('orig', '제목')
    const clone = cloneSection(original) as TitleSection
    clone.content.text = '변경'
    expect(original.content.text).toBe('제목')
  })
})

describe('insertSection', () => {
  it('선택 변경 없이 지정 위치에 삽입', () => {
    const store = makeStore([titleChild('a'), titleChild('b')])
    store.getState().selectSection('a')

    store.getState().insertSection(titleChild('x'), 1)
    expect(store.getState().sections.map((s) => s.id)).toEqual(['a', 'x', 'b'])
    expect(store.getState().selectedSectionId).toBe('a')
  })
})

describe('remapSectionImages', () => {
  it('이미지 src를 새 URL로 교체', () => {
    const store = makeStore([imageChild('img', 'old.jpg')])
    store.getState().remapSectionImages('img', new Map([['old.jpg', 'new.jpg']]))
    expect((store.getState().sections[0] as ImageSection).content.src).toBe('new.jpg')
  })

  it('갤러리와 컨테이너 배경을 교체', () => {
    const gallery: GallerySection & { container?: ContainerStyle } = {
      id: 'g',
      type: 'gallery',
      content: { images: [{ url: 'g-old.jpg', alt: '' }] },
      style: { displayMode: 'grid', shape: 'square', gap: 'small' },
      container: { backgroundImage: 'bg-old.jpg' },
    }
    const store = makeStore([gallery])
    store.getState().remapSectionImages(
      'g',
      new Map([
        ['g-old.jpg', 'g-new.jpg'],
        ['bg-old.jpg', 'bg-new.jpg'],
      ]),
    )
    const result = store.getState().sections[0] as GallerySection & { container?: ContainerStyle }
    expect(result.content.images[0].url).toBe('g-new.jpg')
    expect(result.container?.backgroundImage).toBe('bg-new.jpg')
  })

  it('카드 이미지를 교체', () => {
    const card: CardSection = {
      id: 'c',
      type: 'card',
      content: { cards: [{ id: '1', image: 'old.jpg', alt: '', title: '', description: '' }] },
      style: { layout: 'grid', align: 'left' },
    }
    const store = makeStore([card])
    store.getState().remapSectionImages('c', new Map([['old.jpg', 'new.jpg']]))
    expect((store.getState().sections[0] as CardSection).content.cards[0].image).toBe('new.jpg')
  })

  it('열 칸 이미지를 교체', () => {
    const store = makeStore([columnsWith([[imageChild('ci', 'old.jpg')], []])])
    store.getState().remapSectionImages('col', new Map([['old.jpg', 'new.jpg']]))
    const child = columnsOf(store).content.columns[0][0] as ImageSection
    expect(child.content.src).toBe('new.jpg')
  })

  it('빈 맵이면 변경 없음', () => {
    const store = makeStore([imageChild('img', 'old.jpg')])
    const before = store.getState().sections
    store.getState().remapSectionImages('img', new Map())
    expect(store.getState().sections).toBe(before)
  })
})
