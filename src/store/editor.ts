import { nanoid } from 'nanoid'
import { create } from 'zustand'

import type { Section, SectionType, TextStyle } from '@/types/section'

export type SaveStatus = 'saved' | 'unsaved' | 'saving'

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

  initialize: (page: EditorInitialPage) => void
  setTitle: (title: string) => void
  selectSection: (id: string | null) => void
  addSection: (type: SectionType, index?: number) => void
  updateSectionContent: (id: string, content: Partial<Section['content']>) => void
  updateSectionStyle: (id: string, style: Partial<TextStyle>) => void
  removeSection: (id: string) => void
  moveSection: (fromIndex: number, toIndex: number) => void
  setSaveStatus: (status: SaveStatus) => void
  markSaved: () => void
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

const dirty = { isDirty: true, saveStatus: 'unsaved' as const }

const useEditorStore = create<EditorState>((set) => ({
  pageId: '',
  title: '',
  isPublic: false,
  sections: [],
  selectedSectionId: null,
  isDirty: false,
  saveStatus: 'saved',

  initialize: (page) =>
    set({
      pageId: page.pageId,
      title: page.title,
      isPublic: page.isPublic,
      sections: page.sections,
      selectedSectionId: null,
      isDirty: false,
      saveStatus: 'saved',
    }),

  setTitle: (title) => set({ title, ...dirty }),

  selectSection: (id) => set({ selectedSectionId: id }),

  addSection: (type, index) =>
    set((state) => {
      const section = createSection(type)
      const sections = [...state.sections]
      sections.splice(index ?? sections.length, 0, section)
      return { sections, selectedSectionId: section.id, ...dirty }
    }),

  updateSectionContent: (id, content) =>
    set((state) => ({
      sections: state.sections.map((s) =>
        s.id === id ? { ...s, content: { ...s.content, ...content } } : s,
      ),
      ...dirty,
    })),

  updateSectionStyle: (id, style) =>
    set((state) => ({
      sections: state.sections.map((s) =>
        s.id === id ? { ...s, style: { ...s.style, ...style } } : s,
      ),
      ...dirty,
    })),

  removeSection: (id) =>
    set((state) => ({
      sections: state.sections.filter((s) => s.id !== id),
      selectedSectionId: state.selectedSectionId === id ? null : state.selectedSectionId,
      ...dirty,
    })),

  moveSection: (fromIndex, toIndex) =>
    set((state) => {
      const sections = [...state.sections]
      const [moved] = sections.splice(fromIndex, 1)
      if (!moved) {
        return state
      }
      sections.splice(toIndex, 0, moved)
      return { sections, ...dirty }
    }),

  setSaveStatus: (saveStatus) => set({ saveStatus }),

  markSaved: () => set({ isDirty: false, saveStatus: 'saved' }),
}))

export default useEditorStore
