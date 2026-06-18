import SectionTextView from './SectionTextView'
import type { TitleSection } from '@/types/section'

// 글자 크기는 HTML 태그/클래스 매핑
export const TITLE_TAG = { xlarge: 'h1', large: 'h2', medium: 'h3', small: 'p' } as const
export const TITLE_SIZE = {
  xlarge: 'text-4xl sm:text-5xl',
  large: 'text-3xl sm:text-4xl',
  medium: 'text-2xl',
  small: 'text-lg',
} as const

const SectionTitleView = ({
  section,
  placeholder,
  className,
}: {
  section: TitleSection
  placeholder?: string
  className?: string
}) => (
  <SectionTextView
    text={section.content.text}
    style={section.style}
    sizeClass={TITLE_SIZE[section.style.size]}
    leadingClass="leading-tight tracking-tight"
    tag={TITLE_TAG[section.style.size]}
    placeholder={placeholder}
    className={className}
  />
)

export default SectionTitleView
