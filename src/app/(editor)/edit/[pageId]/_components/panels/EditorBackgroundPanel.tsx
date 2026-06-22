'use client'

import EditorColorField from './EditorColorField'
import EditorImageField from './EditorImageField'
import { deleteImage } from '@/actions/upload'
import useEditorStore from '@/store/editor'
import type { Section } from '@/types/section'

// 섹션 박스 배경
const EditorBackgroundPanel = ({ section }: { section: Section }) => {
  const updateSectionContainer = useEditorStore((s) => s.updateSectionContainer)
  const backgroundColor = section.container?.backgroundColor ?? ''
  const backgroundImage = section.container?.backgroundImage ?? ''

  const handleChange = (uploaded: { url: string }) => {
    const old = backgroundImage
    updateSectionContainer(section.id, { backgroundImage: uploaded.url })
    if (old) {
      void deleteImage(old)
    }
  }

  const handleRemove = () => {
    if (backgroundImage) {
      void deleteImage(backgroundImage)
    }
    updateSectionContainer(section.id, { backgroundImage: '' })
  }

  return (
    <>
      <EditorColorField
        label="배경색"
        color={backgroundColor}
        onChange={(color) => updateSectionContainer(section.id, { backgroundColor: color })}
        defaultColor="var(--background)"
      />
      <EditorImageField
        label="배경 이미지"
        url={backgroundImage}
        onChange={handleChange}
        onRemove={handleRemove}
      />
    </>
  )
}

export default EditorBackgroundPanel
