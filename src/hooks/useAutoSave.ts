import { useEffect } from 'react'
import { toast } from 'sonner'

import { savePage } from '@/actions/page'
import useEditorStore, { serializeContent } from '@/store/editor'

const AUTOSAVE_DELAY = 5000

// 디바운스를 건너뛰고 현재 변경분을 즉시 저장
export const saveNow = async () => {
  const { pageId, title, sections, isDirty } = useEditorStore.getState()
  if (!isDirty) {
    return
  }

  const snapshot = serializeContent(title, sections)
  const result = await savePage(pageId, { title, sections })
  if (result.ok) {
    useEditorStore.getState().markSaved(snapshot)
  } else {
    useEditorStore.getState().setSaveStatus('unsaved')
    toast.error(result.message)
  }
}

// 변경사항 5초 간격 디바운스로 자동 저장
const useAutoSave = () => {
  const isDirty = useEditorStore((s) => s.isDirty)
  const title = useEditorStore((s) => s.title)
  const sections = useEditorStore((s) => s.sections)

  useEffect(() => {
    if (!isDirty) {
      return
    }
    const timer = setTimeout(saveNow, AUTOSAVE_DELAY)
    return () => clearTimeout(timer)
  }, [isDirty, title, sections])
}

export default useAutoSave
