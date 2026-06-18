'use client'

import SectionText from './SectionText'
import { TITLE_SIZE, TITLE_TAG } from '@/components/sections/SectionTitleView'
import type { TitleSection } from '@/types/section'

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
