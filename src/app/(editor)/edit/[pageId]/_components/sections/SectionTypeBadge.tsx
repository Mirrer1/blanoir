import { cn } from '@/lib/utils'
import type { Section, SectionType } from '@/types/section'

const TYPE_LABEL: Record<SectionType, string> = {
  title: '제목',
  paragraph: '문단',
  divider: '구분선',
  spacer: '공백',
  button: '버튼',
  image: '이미지',
  gallery: '갤러리',
  card: '카드',
  columns: '열',
}

// 열칸 수
const labelOf = (section: Section) =>
  section.type === 'columns' ? `${section.content.columns.length}열` : TYPE_LABEL[section.type]

// 편집 화면에서 섹션 종류 뱃지 형태로 표시
const SectionTypeBadge = ({ section, show }: { section: Section; show: boolean }) => (
  <span
    className={cn(
      'bg-foreground/80 text-background pointer-events-none absolute top-1 left-1 z-10 rounded px-1.5 py-0.5 text-[10px] font-medium transition-opacity',
      show ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
    )}
  >
    {labelOf(section)}
  </span>
)

export default SectionTypeBadge
