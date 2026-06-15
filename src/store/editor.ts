import { nanoid } from 'nanoid'
import { create } from 'zustand'

import type { Section, SectionType, TextStyle } from '@/types/section'

export type SaveStatus = 'saved' | 'unsaved'

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

  initialize: (page: EditorInitialPage) => void
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

// 저장본 스냅샷과 비교해 실제 변경 여부로 dirty 계산
const dirtyFrom = (title: string, sections: Section[], savedSnapshot: string) => {
  const isDirty = serializeContent(title, sections) !== savedSnapshot
  return { isDirty, saveStatus: (isDirty ? 'unsaved' : 'saved') as SaveStatus }
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

const useEditorStore = create<EditorState>((set) => ({
  pageId: '',
  title: '',
  isPublic: false,
  sections: [],
  selectedSectionId: null,
  isDirty: false,
  saveStatus: 'saved',
  savedSnapshot: '',

  initialize: (page) =>
    set({
      pageId: page.pageId,
      title: page.title,
      isPublic: page.isPublic,
      sections: page.sections,
      selectedSectionId: null,
      isDirty: false,
      saveStatus: 'saved',
      savedSnapshot: serializeContent(page.title, page.sections),
    }),

  setTitle: (title) => set((s) => ({ title, ...dirtyFrom(title, s.sections, s.savedSnapshot) })),

  selectSection: (id) => set({ selectedSectionId: id }),

  addSection: (type, index) =>
    set((s) => {
      const section = createSection(type)
      const sections = [...s.sections]
      sections.splice(index ?? sections.length, 0, section)
      return {
        sections,
        selectedSectionId: section.id,
        ...dirtyFrom(s.title, sections, s.savedSnapshot),
      }
    }),

  updateSectionContent: (id, content) =>
    set((s) => {
      const sections = s.sections.map((section) =>
        section.id === id ? { ...section, content: { ...section.content, ...content } } : section,
      )
      return { sections, ...dirtyFrom(s.title, sections, s.savedSnapshot) }
    }),

  updateSectionStyle: (id, style) =>
    set((s) => {
      const sections = s.sections.map((section) =>
        section.id === id ? { ...section, style: { ...section.style, ...style } } : section,
      )
      return { sections, ...dirtyFrom(s.title, sections, s.savedSnapshot) }
    }),

  removeSection: (id) =>
    set((s) => {
      const sections = s.sections.filter((section) => section.id !== id)
      return {
        sections,
        selectedSectionId: s.selectedSectionId === id ? null : s.selectedSectionId,
        ...dirtyFrom(s.title, sections, s.savedSnapshot),
      }
    }),

  moveSection: (fromIndex, toIndex) =>
    set((s) => {
      const sections = [...s.sections]
      const [moved] = sections.splice(fromIndex, 1)
      if (!moved) {
        return s
      }
      sections.splice(toIndex, 0, moved)
      return { sections, ...dirtyFrom(s.title, sections, s.savedSnapshot) }
    }),

  setSaveStatus: (saveStatus) => set({ saveStatus }),

  markSaved: (savedSnapshot) =>
    set((s) => ({ savedSnapshot, ...dirtyFrom(s.title, s.sections, savedSnapshot) })),
}))

export default useEditorStore
