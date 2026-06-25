'use client'

import SectionCard from './SectionCard'
import SectionColumns from './SectionColumns'
import SectionGallery from './SectionGallery'
import SectionImage from './SectionImage'
import SectionParagraph from './SectionParagraph'
import SectionTitle from './SectionTitle'
import SectionButton from '@/components/sections/SectionButton'
import SectionDivider from '@/components/sections/SectionDivider'
import SectionSpacer from '@/components/sections/SectionSpacer'
import type { Section } from '@/types/section'

interface EditorSectionContentProps {
  section: Section
  isSelected?: boolean
}

const EditorSectionContent = ({ section, isSelected = false }: EditorSectionContentProps) => {
  return (
    <>
      {section.type === 'title' && <SectionTitle section={section} isSelected={isSelected} />}
      {section.type === 'paragraph' && (
        <SectionParagraph section={section} isSelected={isSelected} />
      )}
      {section.type === 'image' && <SectionImage section={section} isSelected={isSelected} />}
      {section.type === 'divider' && <SectionDivider section={section} />}
      {section.type === 'spacer' && <SectionSpacer section={section} />}
      {section.type === 'button' && <SectionButton section={section} />}
      {section.type === 'gallery' && <SectionGallery section={section} />}
      {section.type === 'card' && <SectionCard section={section} />}
      {section.type === 'columns' && <SectionColumns section={section} />}
    </>
  )
}

export default EditorSectionContent
