import { useEffect } from 'react'

import { saveNow } from './useAutoSave'
import useEditorStore from '@/store/editor'

// 미저장 변경 보호
const useUnsavedGuard = () => {
  const isDirty = useEditorStore((s) => s.isDirty)

  useEffect(() => {
    if (!isDirty) {
      return
    }
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [isDirty])

  // 에디터 이탈 시 남은 변경분을 백그라운드 저장
  useEffect(() => () => void saveNow(), [])
}

export default useUnsavedGuard
