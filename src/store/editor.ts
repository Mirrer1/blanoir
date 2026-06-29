'use client'

import { nanoid } from 'nanoid'
import { createContext, useContext } from 'react'
import { useStore } from 'zustand'
import { createStore } from 'zustand/vanilla'

import type {
  ButtonStyle,
  CardStyle,
  ColumnChild,
  ColumnChildType,
  ColumnsStyle,
  ContainerStyle,
  DividerStyle,
  GalleryStyle,
  ImageStyle,
  Section,
  SectionStyle,
  SectionType,
  SpacerStyle,
  TextStyle,
} from '@/types/section'

export type SaveStatus = 'idle' | 'saved' | 'manualSaved' | 'unsaved'

export type PanelTab = 'content' | 'background'

export interface PageSummary {
  pageId: string
  title: string
  isPublic: boolean
}

export interface EditorInitialPage {
  pageId: string
  handle: string
  title: string
  isPublic: boolean
  sections: Section[]
  myPages: PageSummary[]
}

interface EditorState {
  pageId: string
  handle: string
  title: string
  isPublic: boolean
  sections: Section[]
  myPages: PageSummary[] // 버튼 링크용 내 다른 페이지 목록으로 저장 대상은 아님
  selectedSectionId: string | null
  panelTab: PanelTab
  imageUploading: boolean
  isDirty: boolean
  saveStatus: SaveStatus
  savedSnapshot: string
  initialSnapshot: string

  setTitle: (title: string) => void
  setPublic: (isPublic: boolean) => void
  selectSection: (id: string | null, tab?: PanelTab) => void
  setPanelTab: (tab: PanelTab) => void
  setImageUploading: (uploading: boolean) => void
  addSection: (type: SectionType, index?: number, columnsCount?: number) => void
  replaceSections: (sections: Section[]) => void
  updateSectionContent: (id: string, content: Partial<Section['content']>) => void
  updateSectionStyle: (id: string, style: Partial<SectionStyle>) => void
  updateSectionContainer: (id: string, container: Partial<ContainerStyle>) => void
  removeSection: (id: string) => void
  restoreSection: (section: Section, index: number) => void
  moveSection: (fromIndex: number, toIndex: number) => void
  addColumnChild: (sectionId: string, colIndex: number, type: ColumnChildType) => void
  removeColumnChild: (childId: string) => void
  restoreColumnChild: (sectionId: string, colIndex: number, child: ColumnChild) => void
  setColumnWidths: (sectionId: string, widths: number[]) => void
  moveColumn: (sectionId: string, from: number, to: number) => void
  setSaveStatus: (status: SaveStatus) => void
  markSaved: (savedSnapshot: string, manual?: boolean) => void
}

export const serializeContent = (title: string, sections: Section[]) =>
  JSON.stringify({ title, sections })

// 저장본 스냅샷과 비교해 변경 여부 계산
const dirtyFrom = (
  title: string,
  sections: Section[],
  savedSnapshot: string,
  initialSnapshot: string,
) => {
  const serialized = serializeContent(title, sections)
  const isDirty = serialized !== savedSnapshot
  const saveStatus: SaveStatus = isDirty
    ? 'unsaved'
    : serialized === initialSnapshot
      ? 'idle'
      : 'saved'
  return { isDirty, saveStatus }
}

const DEFAULT_TEXT_STYLE: TextStyle = {
  size: 'medium',
  color: '',
  align: 'left',
  bold: false,
  italic: false,
  font: 'pretendard',
}

const DEFAULT_DIVIDER_STYLE: DividerStyle = {
  variant: 'solid',
  thickness: 'thin',
  color: '',
}

const DEFAULT_BUTTON_STYLE: ButtonStyle = {
  color: '',
  textColor: '',
  shape: 'square',
  size: 'medium',
  width: 'auto',
  align: 'center',
}

const DEFAULT_SPACER_STYLE: SpacerStyle = {
  size: 'medium',
}

const DEFAULT_IMAGE_STYLE: ImageStyle = {
  size: 'large',
  shape: 'rounded',
  align: 'center',
  ratio: 'original',
  zoom: 1,
  focusX: 50,
  focusY: 50,
}

const DEFAULT_GALLERY_STYLE: GalleryStyle = {
  displayMode: 'grid',
  shape: 'rounded',
  gap: 'medium',
}

const DEFAULT_CARD_STYLE: CardStyle = {
  layout: 'grid',
  align: 'left',
}

// 6칸 그리드를 칸 수로 균등 분할
const evenWidths = (count: number): number[] => Array.from({ length: count }, () => 6 / count)

const createSection = (type: SectionType, columnsCount = 2): Section => {
  const id = nanoid(8)
  if (type === 'columns') {
    return {
      id,
      type,
      content: { columns: Array.from({ length: columnsCount }, () => []) },
      style: { widths: evenWidths(columnsCount) } satisfies ColumnsStyle,
    }
  }
  if (type === 'title') {
    return {
      id,
      type,
      content: { text: '' },
      style: { ...DEFAULT_TEXT_STYLE, size: 'large', bold: true },
    }
  }
  if (type === 'divider') {
    return { id, type, content: {}, style: { ...DEFAULT_DIVIDER_STYLE } }
  }
  if (type === 'spacer') {
    return { id, type, content: {}, style: { ...DEFAULT_SPACER_STYLE } }
  }
  if (type === 'button') {
    return { id, type, content: { text: '버튼', url: '' }, style: { ...DEFAULT_BUTTON_STYLE } }
  }
  if (type === 'image') {
    return { id, type, content: { src: '', alt: '' }, style: { ...DEFAULT_IMAGE_STYLE } }
  }
  if (type === 'gallery') {
    return { id, type, content: { images: [] }, style: { ...DEFAULT_GALLERY_STYLE } }
  }
  if (type === 'card') {
    return {
      id,
      type,
      content: { cards: [] },
      style: { ...DEFAULT_CARD_STYLE },
    }
  }
  return { id, type, content: { text: '' }, style: { ...DEFAULT_TEXT_STYLE } }
}

// 배열 원소를 from→to로 이동
const moveItem = <T>(arr: T[], from: number, to: number): T[] => {
  const next = [...arr]
  const [moved] = next.splice(from, 1)
  next.splice(to, 0, moved)
  return next
}

// top-level 섹션이든 열 섹션 칸 자식이든 id로 찾아 갱신
type EditorNode = Section | ColumnChild
const mapNode = (
  sections: Section[],
  id: string,
  fn: (node: EditorNode) => EditorNode,
): Section[] =>
  sections.map((section) => {
    if (section.id === id) {
      return fn(section) as Section
    }
    if (section.type === 'columns') {
      let touched = false
      const columns = section.content.columns.map((col) =>
        col.map((child) => {
          if (child.id === id) {
            touched = true
            return fn(child) as ColumnChild
          }
          return child
        }),
      )
      if (touched) {
        return { ...section, content: { ...section.content, columns } }
      }
    }
    return section
  })

// 섹션이나 칸 자식을 id로 조회
export const findNode = (sections: Section[], id: string | null): EditorNode | null => {
  if (!id) {
    return null
  }
  for (const section of sections) {
    if (section.id === id) {
      return section
    }
    if (section.type === 'columns') {
      for (const col of section.content.columns) {
        for (const child of col) {
          if (child.id === id) {
            return child
          }
        }
      }
    }
  }
  return null
}

// 노드를 담은 top-level 섹션을 조회 후 칸 자식이면 부모 열 섹션을 리턴
export const findContainerSection = (sections: Section[], id: string | null): Section | null => {
  if (!id) {
    return null
  }
  for (const section of sections) {
    if (section.id === id) {
      return section
    }
    if (section.type === 'columns') {
      if (section.content.columns.some((col) => col.some((child) => child.id === id))) {
        return section
      }
    }
  }
  return null
}

// 서버 데이터로 초기화된 페이지별 스토어 생성
export const createEditorStore = (initial: EditorInitialPage) => {
  const snapshot = serializeContent(initial.title, initial.sections)
  return createStore<EditorState>()((set) => ({
    pageId: initial.pageId,
    handle: initial.handle,
    title: initial.title,
    isPublic: initial.isPublic,
    sections: initial.sections,
    myPages: initial.myPages,
    selectedSectionId: null,
    panelTab: 'content',
    imageUploading: false,
    isDirty: false,
    saveStatus: 'idle',
    savedSnapshot: snapshot,
    initialSnapshot: snapshot,

    // 페이지 제목 변경
    setTitle: (title) =>
      set((s) => ({ title, ...dirtyFrom(title, s.sections, s.savedSnapshot, s.initialSnapshot) })),

    // 공개 여부 변경
    setPublic: (isPublic) => set({ isPublic }),

    // 섹션 선택과 함께 표시할 패널 탭 지정
    selectSection: (id, tab) =>
      set(tab ? { selectedSectionId: id, panelTab: tab } : { selectedSectionId: id }),

    // 패널 탭 전환
    setPanelTab: (panelTab) => set({ panelTab }),

    // 이미지 업로드 진행 여부
    setImageUploading: (imageUploading) => set({ imageUploading }),

    // 지정 위치에 새 섹션 삽입 후 선택
    addSection: (type, index, columnsCount) =>
      set((s) => {
        const section = createSection(type, columnsCount)
        const sections = [...s.sections]
        sections.splice(index ?? sections.length, 0, section)
        return {
          sections,
          selectedSectionId: section.id,
          panelTab: 'content',
          ...dirtyFrom(s.title, sections, s.savedSnapshot, s.initialSnapshot),
        }
      }),

    // 템플릿 적용과 실행취소 시 전체 섹션 교체
    replaceSections: (sections) =>
      set((s) => ({
        sections,
        selectedSectionId: null,
        ...dirtyFrom(s.title, sections, s.savedSnapshot, s.initialSnapshot),
      })),

    // 특정 노드의 콘텐츠 갱신
    updateSectionContent: (id, content) =>
      set((s) => {
        const sections = mapNode(
          s.sections,
          id,
          (node) => ({ ...node, content: { ...node.content, ...content } }) as EditorNode,
        )
        return { sections, ...dirtyFrom(s.title, sections, s.savedSnapshot, s.initialSnapshot) }
      }),

    // 특정 노드의 스타일 갱신
    updateSectionStyle: (id, style) =>
      set((s) => {
        const sections = mapNode(
          s.sections,
          id,
          (node) => ({ ...node, style: { ...node.style, ...style } }) as EditorNode,
        )
        return { sections, ...dirtyFrom(s.title, sections, s.savedSnapshot, s.initialSnapshot) }
      }),

    // 섹션 박스 속성 갱신
    updateSectionContainer: (id, container) =>
      set((s) => {
        const sections = s.sections.map((section) =>
          section.id === id
            ? ({ ...section, container: { ...section.container, ...container } } as Section)
            : section,
        )
        return { sections, ...dirtyFrom(s.title, sections, s.savedSnapshot, s.initialSnapshot) }
      }),

    // 섹션을 삭제하고 선택 중이면 해제
    removeSection: (id) =>
      set((s) => {
        const sections = s.sections.filter((section) => section.id !== id)
        return {
          sections,
          selectedSectionId: s.selectedSectionId === id ? null : s.selectedSectionId,
          ...dirtyFrom(s.title, sections, s.savedSnapshot, s.initialSnapshot),
        }
      }),

    // 삭제 실행취소
    restoreSection: (section, index) =>
      set((s) => {
        const sections = [...s.sections]
        sections.splice(Math.min(index, sections.length), 0, section)
        return {
          sections,
          selectedSectionId: section.id,
          ...dirtyFrom(s.title, sections, s.savedSnapshot, s.initialSnapshot),
        }
      }),

    // 섹션 순서 이동
    moveSection: (fromIndex, toIndex) =>
      set((s) => {
        const sections = [...s.sections]
        const [moved] = sections.splice(fromIndex, 1)
        if (!moved) {
          return s
        }
        sections.splice(toIndex, 0, moved)
        return { sections, ...dirtyFrom(s.title, sections, s.savedSnapshot, s.initialSnapshot) }
      }),

    // 열 칸에 새 블록 생성 후 선택
    addColumnChild: (sectionId, colIndex, type) =>
      set((s) => {
        const child = createSection(type) as ColumnChild
        const sections = s.sections.map((section) => {
          if (section.id !== sectionId || section.type !== 'columns') {
            return section
          }
          const columns = section.content.columns.map((col, i) => (i === colIndex ? [child] : col))
          return { ...section, content: { ...section.content, columns } }
        })
        return {
          sections,
          selectedSectionId: child.id,
          panelTab: 'content',
          ...dirtyFrom(s.title, sections, s.savedSnapshot, s.initialSnapshot),
        }
      }),

    // 열 칸 블록을 비우고 선택 중이면 해제
    removeColumnChild: (childId) =>
      set((s) => {
        const sections = s.sections.map((section) => {
          if (section.type !== 'columns') {
            return section
          }
          let touched = false
          const columns = section.content.columns.map((col) => {
            if (col.some((child) => child.id === childId)) {
              touched = true
              return []
            }
            return col
          })
          return touched ? { ...section, content: { ...section.content, columns } } : section
        })
        return {
          sections,
          selectedSectionId: s.selectedSectionId === childId ? null : s.selectedSectionId,
          ...dirtyFrom(s.title, sections, s.savedSnapshot, s.initialSnapshot),
        }
      }),

    // 칸 블록 삭제 실행취소
    restoreColumnChild: (sectionId, colIndex, child) =>
      set((s) => {
        const sections = s.sections.map((section) => {
          if (section.id !== sectionId || section.type !== 'columns') {
            return section
          }
          const columns = section.content.columns.map((col, i) => (i === colIndex ? [child] : col))
          return { ...section, content: { ...section.content, columns } }
        })
        return {
          sections,
          selectedSectionId: child.id,
          panelTab: 'content',
          ...dirtyFrom(s.title, sections, s.savedSnapshot, s.initialSnapshot),
        }
      }),

    // 열 칸 너비 비율 설정
    setColumnWidths: (sectionId, widths) =>
      set((s) => {
        const sections = s.sections.map((section) =>
          section.id === sectionId && section.type === 'columns'
            ? { ...section, style: { ...section.style, widths } }
            : section,
        )
        return { sections, ...dirtyFrom(s.title, sections, s.savedSnapshot, s.initialSnapshot) }
      }),

    // 열을 from에서 to로 옮기며 내용과 너비도 함께 이동
    moveColumn: (sectionId, from, to) =>
      set((s) => {
        const sections = s.sections.map((section) => {
          if (section.id !== sectionId || section.type !== 'columns') {
            return section
          }
          return {
            ...section,
            content: { ...section.content, columns: moveItem(section.content.columns, from, to) },
            style: { ...section.style, widths: moveItem(section.style.widths, from, to) },
          }
        })
        return { sections, ...dirtyFrom(s.title, sections, s.savedSnapshot, s.initialSnapshot) }
      }),

    // 저장 상태 직접 설정
    setSaveStatus: (saveStatus) => set({ saveStatus }),

    // 저장 완료 후 스냅샷 갱신
    markSaved: (savedSnapshot, manual = false) =>
      set((s) => {
        const next = dirtyFrom(s.title, s.sections, savedSnapshot, s.initialSnapshot)
        return {
          savedSnapshot,
          ...next,
          saveStatus: manual && next.saveStatus === 'saved' ? 'manualSaved' : next.saveStatus,
        }
      }),
  }))
}

export type EditorStore = ReturnType<typeof createEditorStore>

export const EditorStoreContext = createContext<EditorStore | null>(null)

// 자동저장 등 비React 영역에서 현재 페이지 스토어 접근
let currentStore: EditorStore | null = null

export const setCurrentEditorStore = (store: EditorStore | null) => {
  currentStore = store
}

export const getEditorStore = () => {
  if (!currentStore) {
    throw new Error('에디터 스토어가 초기화되지 않았어요')
  }
  return currentStore
}

const useEditorStore = <T>(selector: (state: EditorState) => T): T => {
  const store = useContext(EditorStoreContext)
  if (!store) {
    throw new Error('useEditorStore는 EditorProvider 안에서만 쓸 수 있어요')
  }
  return useStore(store, selector)
}

export default useEditorStore
