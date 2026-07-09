import PublicSection from './PublicSection'
import type { Section } from '@/types/section'

// 공개 페이지와 에디터 미리보기가 공유하는 섹션 렌더 레이아웃
const PublicPageBody = ({ sections }: { sections: Section[] }) => (
  <div className="@container flex flex-col overflow-x-clip">
    {sections.map((section) => (
      <PublicSection key={section.id} section={section} />
    ))}
  </div>
)

export default PublicPageBody
