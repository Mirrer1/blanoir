'use client'

import { LogIn } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'

import { Button } from '@/components/ui/button'

interface ExploreLoginGateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  message: string
}

// 비로그인 사용자가 로그인 필요한 동작을 눌렀을 때 뜨는 공용 안내 모달
// 미리보기 위에도 겹치도록 base-ui 중첩 대신 포털 오버레이로 띄움
const ExploreLoginGate = ({ open, onOpenChange, message }: ExploreLoginGateProps) => {
  const router = useRouter()

  // Esc로 닫기
  useEffect(() => {
    if (!open) {
      return
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onOpenChange(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onOpenChange])

  if (!open) {
    return null
  }

  // 백드롭 클릭은 닫고 팝업 내부 클릭은 전파를 막아 유지
  return createPortal(
    <div
      role="presentation"
      onClick={() => onOpenChange(false)}
      className="animate-in fade-in-0 fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm duration-150"
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
        className="animate-in zoom-in-95 bg-background w-full max-w-sm rounded-xl border p-6 shadow-lg duration-150"
      >
        <div className="flex items-center gap-3">
          <span className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-full">
            <LogIn className="size-5" />
          </span>
          <p className="text-base font-medium">{message}</p>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button size="sm" onClick={() => router.push('/login')}>
            로그인
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default ExploreLoginGate
