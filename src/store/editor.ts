import { nanoid } from 'nanoid'
import { create } from 'zustand'

import type { Section, SectionType, TextStyle } from '@/types/section'

export type SaveStatus = 'idle' | 'saved' | 'unsaved'

export interface EditorInitialPage {
  pageId: string
  title: string
  isPublic: boolean
  sections: Section[]
}

interface EditorState {
  pageId: string
  title: string
  isPublic: boolean
  sections: Section[]
  selectedSectionId: string | null
  isDirty: boolean
  saveStatus: SaveStatus
  savedSnapshot: string
  initialSnapshot: string

  initialize: (page: EditorInitialPage) => void
  reset: () => void
  setTitle: (title: string) => void
  selectSection: (id: string | null) => void
  addSection: (type: SectionType, index?: number) => void
  updateSectionContent: (id: string, content: Partial<Section['content']>) => void
  updateSectionStyle: (id: string, style: Partial<TextStyle>) => void
  removeSection: (id: string) => void
  moveSection: (fromIndex: number, toIndex: number) => void
  setSaveStatus: (status: SaveStatus) => void
  markSaved: (savedSnapshot: string) => void
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

const createSection = (type: SectionType): Section => {
  const id = nanoid(8)
  if (type === 'title') {
    return {
      id,
      type,
      content: { text: '' },
      style: { ...DEFAULT_TEXT_STYLE, size: 'large', bold: true },
    }
  }
  return { id, type, content: { text: '' }, style: { ...DEFAULT_TEXT_STYLE } }
}

const INITIAL_STATE = {
  pageId: '',
  title: '',
  isPublic: false,
  sections: [] as Section[],
  selectedSectionId: null as string | null,
  isDirty: false,
  saveStatus: 'idle' as SaveStatus,
  savedSnapshot: '',
  initialSnapshot: '',
}

const useEditorStore = create<EditorState>((set) => ({
  ...INITIAL_STATE,

  // 서버에서 받은 페이지로 스토어 초기화
  initialize: (page) =>
    set({
      pageId: page.pageId,
      title: page.title,
      isPublic: page.isPublic,
      sections: page.sections,
      selectedSectionId: null,
      isDirty: false,
      saveStatus: 'idle',
      savedSnapshot: serializeContent(page.title, page.sections),
      initialSnapshot: serializeContent(page.title, page.sections),
    }),

  // 에디터 이탈 시 초기 상태로 롤백
  reset: () => set(INITIAL_STATE),

  // 페이지 제목 변경
  setTitle: (title) =>
    set((s) => ({ title, ...dirtyFrom(title, s.sections, s.savedSnapshot, s.initialSnapshot) })),

  // 섹션 선택 또는 선택 해제
  selectSection: (id) => set({ selectedSectionId: id }),

  // 지정 위치에 새 섹션 삽입 후 선택
  addSection: (type, index) =>
    set((s) => {
      const section = createSection(type)
      const sections = [...s.sections]
      sections.splice(index ?? sections.length, 0, section)
      return {
        sections,
        selectedSectionId: section.id,
        ...dirtyFrom(s.title, sections, s.savedSnapshot, s.initialSnapshot),
      }
    }),

  // 특정 섹션의 콘텐츠 갱신
  updateSectionContent: (id, content) =>
    set((s) => {
      const sections = s.sections.map((section) =>
        section.id === id ? { ...section, content: { ...section.content, ...content } } : section,
      )
      return { sections, ...dirtyFrom(s.title, sections, s.savedSnapshot, s.initialSnapshot) }
    }),

  // 특정 섹션의 스타일 갱신
  updateSectionStyle: (id, style) =>
    set((s) => {
      const sections = s.sections.map((section) =>
        section.id === id ? { ...section, style: { ...section.style, ...style } } : section,
      )
      return { sections, ...dirtyFrom(s.title, sections, s.savedSnapshot, s.initialSnapshot) }
    }),

  // 섹션 삭제, 선택 중이던 섹션이면 선택 해제
  removeSection: (id) =>
    set((s) => {
      const sections = s.sections.filter((section) => section.id !== id)
      return {
        sections,
        selectedSectionId: s.selectedSectionId === id ? null : s.selectedSectionId,
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

  // 저장 상태 직접 설정
  setSaveStatus: (saveStatus) => set({ saveStatus }),

  // 저장 완료 후 스냅샷 갱신
  markSaved: (savedSnapshot) =>
    set((s) => ({
      savedSnapshot,
      ...dirtyFrom(s.title, s.sections, savedSnapshot, s.initialSnapshot),
    })),
}))

export default useEditorStore
