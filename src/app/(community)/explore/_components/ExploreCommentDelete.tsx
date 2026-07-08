'use client'

import { AlertDialog } from '@base-ui/react/alert-dialog'
import { useState } from 'react'

import { Button } from '@/components/ui/button'

interface ExploreCommentDeleteProps {
  commentId: string
  onDelete: (commentId: string) => void
}

// 확인만 담당하고 삭제는 리스트에서 처리
const ExploreCommentDelete = ({ commentId, onDelete }: ExploreCommentDeleteProps) => {
  const [open, setOpen] = useState(false)

  const handleDelete = () => {
    setOpen(false)
    onDelete(commentId)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-muted-foreground hover:text-destructive cursor-pointer text-xs"
      >
        삭제
      </button>

      <AlertDialog.Root open={open} onOpenChange={setOpen}>
        <AlertDialog.Portal>
          <AlertDialog.Backdrop className="fixed inset-0 z-50 bg-black/40 transition-opacity duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
          <AlertDialog.Popup className="bg-background fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl border p-6 shadow-lg transition-all duration-150 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0">
            <AlertDialog.Title className="text-base font-semibold">
              댓글을 삭제할까요?
            </AlertDialog.Title>
            <AlertDialog.Description className="text-muted-foreground mt-2 text-sm">
              삭제하면 되돌릴 수 없어요.
            </AlertDialog.Description>
            <div className="mt-6 flex justify-end gap-2">
              <AlertDialog.Close render={<Button variant="outline" size="sm" />}>
                취소
              </AlertDialog.Close>
              <Button variant="destructive" size="sm" onClick={handleDelete}>
                삭제
              </Button>
            </div>
          </AlertDialog.Popup>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </>
  )
}

export default ExploreCommentDelete
