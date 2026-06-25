import { describe, expect, it } from 'vitest'

import type { EditorStore } from './editor'
import { createEditorStore, findNode } from './editor'
import type { ColumnsSection, Section, TitleSection } from '@/types/section'

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
  createEditorStore({ pageId: 'p1', handle: 'h', title: 't', isPublic: false, sections })

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
