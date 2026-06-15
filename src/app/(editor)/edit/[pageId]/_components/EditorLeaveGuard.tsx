'use client'

import { AlertDialog } from '@base-ui/react/alert-dialog'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Button, buttonVariants } from '@/components/ui/button'
import { saveNow } from '@/hooks/useAutoSave'
import useEditorStore from '@/store/editor'

const DASHBOARD = '/dashboard'

const EditorLeaveGuard = () => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [leaving, setLeaving] = useState(false)

  const handleBack = () => {
    if (useEditorStore.getState().isDirty) {
      setOpen(true)
    } else {
      router.push(DASHBOARD)
    }
  }

  const handleLeave = async () => {
    setLeaving(true)
    await saveNow()
    router.push(DASHBOARD)
  }

  // 브라우저 뒤로가기 가로채기
  useEffect(() => {
    window.history.pushState(null, '', window.location.href)
    const onPopState = () => {
      if (useEditorStore.getState().isDirty) {
        window.history.pushState(null, '', window.location.href)
        setOpen(true)
      } else {
        router.push(DASHBOARD)
      }
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [router])

  return (
    <>
      <button
        onClick={handleBack}
        aria-label="대시보드로 나가기"
        className={buttonVariants({ variant: 'ghost', size: 'icon' })}
      >
        <ArrowLeft />
      </button>

      <AlertDialog.Root open={open} onOpenChange={setOpen}>
        <AlertDialog.Portal>
          <AlertDialog.Backdrop className="fixed inset-0 z-50 bg-black/40 transition-opacity duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
          <AlertDialog.Popup className="bg-background fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl border p-6 shadow-lg transition-all duration-150 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0">
            <AlertDialog.Title className="text-base font-semibold">
              저장되지 않은 변경사항이 있어요
            </AlertDialog.Title>
            <AlertDialog.Description className="text-muted-foreground mt-2 text-sm">
              지금 나가면 변경사항을 저장하고 대시보드로 이동해요.
            </AlertDialog.Description>
            <div className="mt-6 flex justify-end gap-2">
              <AlertDialog.Close render={<Button variant="outline" size="sm" />}>
                취소
              </AlertDialog.Close>
              <Button size="sm" onClick={handleLeave} disabled={leaving}>
                저장하고 나가기
              </Button>
            </div>
          </AlertDialog.Popup>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </>
  )
}

export default EditorLeaveGuard
