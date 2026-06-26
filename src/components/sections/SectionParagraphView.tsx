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
  live,
}: {
  section: ParagraphSection
  placeholder?: string
  className?: string
  live?: boolean
}) => (
  <SectionTextView
    text={section.content.text}
    style={section.style}
    sizeClass={PARA_SIZE[section.style.size]}
    leadingClass="leading-relaxed"
    tag="p"
    placeholder={placeholder}
    className={className}
    link={section.content.link}
    live={live}
  />
)

export default SectionParagraphView
