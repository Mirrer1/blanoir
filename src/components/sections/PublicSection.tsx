import SectionButton from './SectionButton'
import SectionCardView from './SectionCardView'
import SectionDivider from './SectionDivider'
import SectionGalleryView from './SectionGalleryView'
import SectionImageView from './SectionImageView'
import SectionParagraphView from './SectionParagraphView'
import SectionReveal from './SectionReveal'
import SectionSpacer from './SectionSpacer'
import SectionTitleView from './SectionTitleView'
import type { Section } from '@/types/section'
import { containerBackground } from '@/utils/colorFill'

// 내용을 안 채운 섹션은 공개 페이지에서 숨김
// divider/spacer는 구조 섹션이라 항상 표시
const isEmptySection = (section: Section) => {
  if (section.type === 'title' || section.type === 'paragraph') {
    return !section.content.text.trim()
  }
  if (section.type === 'image') {
    return !section.content.src
  }
  if (section.type === 'gallery') {
    return section.content.images.length === 0
  }
  if (section.type === 'card') {
    return section.content.cards.length === 0
  }
  // 버튼은 라벨이 항상 있어 숨기지 않음
  // divider/spacer도 구조 섹션이라 표시
  return false
}

// 공개 페이지용 섹션 분기
// 에디터 EditorSection의 표시 전용 대응
const PublicSection = ({ section }: { section: Section }) =>
  isEmptySection(section) ? null : (
    <SectionReveal animation={section.container?.animation}>
      <div
        className="flex flex-col justify-center py-2"
        style={{ ...containerBackground(section), minHeight: section.container?.height }}
      >
        <div className="mx-auto w-full max-w-5xl px-3 py-2">
          {section.type === 'title' && <SectionTitleView section={section} />}
          {section.type === 'paragraph' && <SectionParagraphView section={section} />}
          {section.type === 'image' && <SectionImageView section={section} />}
          {section.type === 'divider' && <SectionDivider section={section} />}
          {section.type === 'spacer' && <SectionSpacer section={section} />}
          {section.type === 'button' && <SectionButton section={section} live />}
          {section.type === 'gallery' && <SectionGalleryView section={section} />}
          {section.type === 'card' && <SectionCardView section={section} />}
        </div>
      </div>
    </SectionReveal>
  )

export default PublicSection
