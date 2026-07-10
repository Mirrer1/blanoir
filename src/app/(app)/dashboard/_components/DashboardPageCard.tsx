import { Share2 } from 'lucide-react'
import Link from 'next/link'

import DashboardDeleteButton from './DashboardDeleteButton'
import DashboardDuplicateButton from './DashboardDuplicateButton'
import { optimizedImageUrl } from '@/utils/cloudinaryOptimize'

interface DashboardPageCardProps {
  page: {
    pageId: string
    title: string
    isPublic: boolean
    sharedToCommunity: boolean
    updatedAt: string
    thumbnail: string
    textPreview: string
  }
  onDuplicate: () => void
}

const DashboardPageCard = ({ page, onDuplicate }: DashboardPageCardProps) => {
  const title = page.title || '제목 없는 페이지'
  const updatedLabel = new Date(page.updatedAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="group relative">
      <Link
        href={`/edit/${page.pageId}`}
        className="group-hover:border-foreground/30 flex flex-col gap-3 rounded-lg border p-4 transition-colors"
      >
        {page.thumbnail ? (
          <img
            src={optimizedImageUrl(page.thumbnail)}
            alt=""
            className="bg-muted/40 aspect-video w-full rounded object-cover"
          />
        ) : (
          <div className="bg-muted/40 flex aspect-video items-center justify-center rounded p-4">
            {page.textPreview ? (
              <p className="text-muted-foreground line-clamp-3 text-center text-sm">
                {page.textPreview}
              </p>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-muted-foreground/40 h-10 w-10"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="9" cy="9" r="1.5" />
                <path d="m21 15-3.5-3.5a2 2 0 0 0-2.8 0L6 21" />
              </svg>
            )}
          </div>
        )}
        <div className="flex items-center justify-between gap-2">
          <span className="truncate font-medium">{title}</span>
          {page.isPublic ? (
            <span className="bg-foreground text-background shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium">
              공개
            </span>
          ) : (
            <span className="text-muted-foreground shrink-0 rounded-full border px-2.5 py-0.5 text-xs">
              비공개
            </span>
          )}
        </div>
        <span className="text-muted-foreground text-xs">{updatedLabel} 수정</span>
      </Link>
      {page.sharedToCommunity && (
        <Link
          href={`/explore/${page.pageId}`}
          className="absolute top-3 left-2 z-10 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs leading-none font-medium text-white ring-1 ring-white/20 backdrop-blur transition-colors hover:bg-black/75"
        >
          <Share2 className="size-3" />
          템플릿 공개
        </Link>
      )}
      <DashboardDuplicateButton onDuplicate={onDuplicate} />
      <DashboardDeleteButton pageId={page.pageId} title={title} />
    </div>
  )
}

export default DashboardPageCard
