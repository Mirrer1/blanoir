'use client'

import { type ReactNode, useEffect, useState } from 'react'

import {
  type EditorInitialPage,
  EditorStoreContext,
  createEditorStore,
  setCurrentEditorStore,
} from '@/store/editor'

interface EditorProviderProps {
  page: EditorInitialPage
  children: ReactNode
}

const EditorProvider = ({ page, children }: EditorProviderProps) => {
  const [store] = useState(() => createEditorStore(page))

  // 이탈 저장이 이 참조를 쓰므로 cleanup에서 비우지 않고 다음 마운트가 덮어씀
  useEffect(() => {
    setCurrentEditorStore(store)
  }, [store])

  return <EditorStoreContext.Provider value={store}>{children}</EditorStoreContext.Provider>
}

export default EditorProvider
