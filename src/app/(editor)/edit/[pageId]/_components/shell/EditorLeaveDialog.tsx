'use client'

import { AlertDialog } from '@base-ui/react/alert-dialog'

import { Button } from '@/components/ui/button'

interface EditorLeaveDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  leaving: boolean
  onConfirm: () => void
}

// 나가기 확인을 공용화
const EditorLeaveDialog = ({ open, onOpenChange, leaving, onConfirm }: EditorLeaveDialogProps) => (
  <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
    <AlertDialog.Portal>
      <AlertDialog.Backdrop className="fixed inset-0 z-50 bg-black/40 transition-opacity duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
      <AlertDialog.Popup className="bg-background fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl border p-6 shadow-lg transition-all duration-150 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0">
        <AlertDialog.Title className="text-base font-semibold">
          저장되지 않은 변경사항이 있어요
        </AlertDialog.Title>
        <AlertDialog.Description className="text-muted-foreground mt-2 text-sm">
          지금 나가면 변경사항을 저장하고 이동해요.
        </AlertDialog.Description>
        <div className="mt-6 flex justify-end gap-2">
          <AlertDialog.Close render={<Button variant="outline" size="sm" />}>
            취소
          </AlertDialog.Close>
          <Button size="sm" onClick={onConfirm} disabled={leaving}>
            저장하고 나가기
          </Button>
        </div>
      </AlertDialog.Popup>
    </AlertDialog.Portal>
  </AlertDialog.Root>
)

export default EditorLeaveDialog
