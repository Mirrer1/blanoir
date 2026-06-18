import Link from 'next/link'

import DashboardDeleteButton from './DashboardDeleteButton'

interface DashboardPageCardProps {
  page: {
    pageId: string
    title: string
    isPublic: boolean
    updatedAt: string
    thumbnail: string
    textPreview: string
  }
}

const DashboardPageCard = ({ page }: DashboardPageCardProps) => {
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
        className="group-hover:border-foreground/30 flex flex-col gap-3 rounded-lg border p-4 transition-all group-hover:-translate-y-1"
      >
        {page.thumbnail ? (
          <img
            src={page.thumbnail}
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
              <span className="text-muted-foreground/60 text-xs">내용 없음</span>
            )}
          </div>
        )}
        <div className="flex items-center justify-between gap-2">
          <span className="truncate font-medium">{title}</span>
          <span className="text-muted-foreground shrink-0 rounded-full border px-2 py-0.5 text-xs">
            {page.isPublic ? '공개' : '비공개'}
          </span>
        </div>
        <span className="text-muted-foreground text-xs">{updatedLabel} 수정</span>
      </Link>
      <DashboardDeleteButton pageId={page.pageId} title={title} />
    </div>
  )
}

export default DashboardPageCard
