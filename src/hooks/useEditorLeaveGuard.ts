'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'

import { saveNow } from './useAutoSave'
import { getEditorStore } from '@/store/editor'

// 이탈 전 저장을 보장
const useEditorLeaveGuard = (destination: string) => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [leaving, setLeaving] = useState(false)

  const requestLeave = useCallback(() => {
    if (getEditorStore().getState().isDirty) {
      setOpen(true)
    } else {
      router.push(destination)
    }
  }, [destination, router])

  const confirmLeave = useCallback(async () => {
    setLeaving(true)
    await saveNow()
    router.push(destination)
  }, [destination, router])

  return { open, setOpen, leaving, requestLeave, confirmLeave }
}

export default useEditorLeaveGuard
