'use client'

import EditorAnimationField from './EditorAnimationField'
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
  const animation = section.container?.animation ?? 'none'

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
      <EditorImageField
        label="배경 이미지"
        url={backgroundImage}
        sectionId={section.id}
        onChange={handleChange}
        onRemove={handleRemove}
      />
      <EditorColorField
        label="배경색"
        color={backgroundColor}
        onChange={(color) => updateSectionContainer(section.id, { backgroundColor: color })}
        defaultColor="var(--background)"
      />
      <EditorAnimationField
        animation={animation}
        onChange={(value) => updateSectionContainer(section.id, { animation: value })}
      />
    </>
  )
}

export default EditorBackgroundPanel
