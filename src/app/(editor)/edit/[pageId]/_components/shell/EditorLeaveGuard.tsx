'use client'

import { ArrowLeft } from 'lucide-react'
import { useEffect } from 'react'

import EditorLeaveDialog from './EditorLeaveDialog'
import { buttonVariants } from '@/components/ui/button'
import useEditorLeaveGuard from '@/hooks/useEditorLeaveGuard'
import { getEditorStore } from '@/store/editor'

const DASHBOARD = '/dashboard'

const EditorLeaveGuard = () => {
  const { open, setOpen, leaving, requestLeave, confirmLeave } = useEditorLeaveGuard(DASHBOARD)

  // 브라우저 뒤로가기 가로채기
  useEffect(() => {
    window.history.pushState(null, '', window.location.href)
    const onPopState = () => {
      if (getEditorStore().getState().isDirty) {
        window.history.pushState(null, '', window.location.href)
      }
      requestLeave()
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [requestLeave])

  return (
    <>
      <button
        onClick={requestLeave}
        aria-label="대시보드로 나가기"
        className={buttonVariants({ variant: 'ghost', size: 'icon' })}
      >
        <ArrowLeft />
      </button>

      <EditorLeaveDialog
        open={open}
        onOpenChange={setOpen}
        leaving={leaving}
        onConfirm={confirmLeave}
      />
    </>
  )
}

export default EditorLeaveGuard
