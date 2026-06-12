import Link from 'next/link'

interface DashboardPageCardProps {
  page: {
    pageId: string
    title: string
    isPublic: boolean
    updatedAt: string
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
    <Link
      href={`/edit/${page.pageId}`}
      className="hover:border-foreground/30 flex flex-col gap-3 rounded-lg border p-4 transition-all hover:-translate-y-1"
    >
      <div className="bg-muted/40 aspect-video rounded" />
      <div className="flex items-center justify-between gap-2">
        <span className="truncate font-medium">{title}</span>
        <span className="text-muted-foreground shrink-0 rounded-full border px-2 py-0.5 text-xs">
          {page.isPublic ? '공개' : '비공개'}
        </span>
      </div>
      <span className="text-muted-foreground text-xs">{updatedLabel} 수정</span>
    </Link>
  )
}

export default DashboardPageCard
