import SectionTextView from './SectionTextView'
import type { ParagraphSection } from '@/types/section'

export const PARA_SIZE = {
  small: 'text-sm',
  medium: 'text-base',
  large: 'text-lg',
  xlarge: 'text-xl',
} as const

const SectionParagraphView = ({
  section,
  placeholder,
  className,
}: {
  section: ParagraphSection
  placeholder?: string
  className?: string
}) => (
  <SectionTextView
    text={section.content.text}
    style={section.style}
    sizeClass={PARA_SIZE[section.style.size]}
    leadingClass="leading-relaxed"
    tag="p"
    placeholder={placeholder}
    className={className}
  />
)

export default SectionParagraphView
