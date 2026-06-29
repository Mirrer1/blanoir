'use client'

import { useOptimistic, useRef, useTransition } from 'react'
import { toast } from 'sonner'

import DashboardPageCard from './DashboardPageCard'
import DashboardPendingCard from './DashboardPendingCard'
import { duplicatePage } from '@/actions/page'
import { makeCopyTitle } from '@/utils/copyTitle'

export interface DashboardItem {
  pageId: string
  title: string
  isPublic: boolean
  updatedAt: string
  thumbnail: string
  textPreview: string
}

type GridItem = DashboardItem & { pending?: boolean }

const DashboardPageGrid = ({ items }: { items: DashboardItem[] }) => {
  const [, startTransition] = useTransition()
  const pendingSeq = useRef(0)
  const [optimisticItems, addPending] = useOptimistic<GridItem[], GridItem>(
    items,
    (state, pending) => [pending, ...state],
  )

  // 임시 카드를 띄운 뒤 복제하고 완료되면 실제 카드로 교체
  const handleDuplicate = (source: DashboardItem) => {
    const pendingId = `pending-${pendingSeq.current++}`
    // 복사 제목을 미리 계산해 처음부터 표시
    const title = makeCopyTitle(source.title, new Set(items.map((item) => item.title)))
    startTransition(async () => {
      addPending({ ...source, pageId: pendingId, pending: true, title })
      const result = await duplicatePage(source.pageId)
      if (!result.ok) {
        toast.error(result.message)
        return
      }
      toast.success('페이지를 복제했어요')
    })
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {optimisticItems.map((item) =>
        item.pending ? (
          <DashboardPendingCard key={item.pageId} item={item} />
        ) : (
          <DashboardPageCard
            key={item.pageId}
            page={item}
            onDuplicate={() => handleDuplicate(item)}
          />
        ),
      )}
    </div>
  )
}

export default DashboardPageGrid
