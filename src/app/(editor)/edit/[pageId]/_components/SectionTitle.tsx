'use client'

import SectionText from './SectionText'
import type { TitleSection } from '@/types/section'

const TITLE_TAG = { xlarge: 'h1', large: 'h2', medium: 'h3', small: 'p' } as const
const TITLE_SIZE = {
  xlarge: 'text-4xl sm:text-5xl',
  large: 'text-3xl sm:text-4xl',
  medium: 'text-2xl',
  small: 'text-lg',
} as const

interface SectionTitleProps {
  section: TitleSection
  isSelected: boolean
}

const SectionTitle = ({ section, isSelected }: SectionTitleProps) => {
  const { size } = section.style

  return (
    <SectionText
      sectionId={section.id}
      text={section.content.text}
      isSelected={isSelected}
      style={section.style}
      sizeClass={TITLE_SIZE[size]}
      leadingClass="leading-tight tracking-tight"
      tag={TITLE_TAG[size]}
      placeholder="제목을 입력하세요"
    />
  )
}

export default SectionTitle
