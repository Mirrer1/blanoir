'use client'

import { AlertDialog } from '@base-ui/react/alert-dialog'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { deletePage } from '@/actions/page'
import { Button } from '@/components/ui/button'

interface DashboardDeleteButtonProps {
  pageId: string
  title: string
}

const DashboardDeleteButton = ({ pageId, title }: DashboardDeleteButtonProps) => {
  const [open, setOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    const result = await deletePage(pageId)
    if (!result.ok) {
      toast.error(result.message)
      setDeleting(false)
      return
    }
    toast.success('페이지를 삭제했어요')
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="페이지 삭제"
        className="bg-background/90 text-muted-foreground hover:text-destructive absolute top-2 right-2 z-10 flex size-8 cursor-pointer items-center justify-center rounded-md border opacity-0 backdrop-blur transition-all group-hover:opacity-100"
      >
        <Trash2 className="size-4" />
      </button>

      <AlertDialog.Root open={open} onOpenChange={setOpen}>
        <AlertDialog.Portal>
          <AlertDialog.Backdrop className="fixed inset-0 z-50 bg-black/40 transition-opacity duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
          <AlertDialog.Popup className="bg-background fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl border p-6 shadow-lg transition-all duration-150 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0">
            <AlertDialog.Title className="text-base font-semibold">
              페이지를 삭제할까요?
            </AlertDialog.Title>
            <AlertDialog.Description className="text-muted-foreground mt-2 text-sm">
              ‘{title}’을(를) 삭제하면 되돌릴 수 없어요.
            </AlertDialog.Description>
            <div className="mt-6 flex justify-end gap-2">
              <AlertDialog.Close render={<Button variant="outline" size="sm" />}>
                취소
              </AlertDialog.Close>
              <Button variant="destructive" size="sm" onClick={handleDelete} loading={deleting}>
                삭제
              </Button>
            </div>
          </AlertDialog.Popup>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </>
  )
}

export default DashboardDeleteButton
