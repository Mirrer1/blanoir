'use client'

import SectionText from './SectionText'
import { PARA_SIZE } from '@/components/sections/SectionParagraphView'
import type { ParagraphSection } from '@/types/section'

interface SectionParagraphProps {
  section: ParagraphSection
  isSelected: boolean
}

const SectionParagraph = ({ section, isSelected }: SectionParagraphProps) => {
  const { size } = section.style

  return (
    <SectionText
      sectionId={section.id}
      text={section.content.text}
      isSelected={isSelected}
      style={section.style}
      sizeClass={PARA_SIZE[size]}
      leadingClass="leading-relaxed"
      tag="p"
      placeholder="내용을 입력하세요"
    />
  )
}

export default SectionParagraph
