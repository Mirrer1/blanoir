import { nanoid } from 'nanoid'

import type { Section } from '@/types/section'

// 섹션 깊은 복제 후 새 id 발급
export const cloneSections = (sections: Section[]): Section[] => {
  const cloned = structuredClone(sections)
  for (const section of cloned) {
    section.id = nanoid(8)
    if (section.type === 'columns') {
      section.content.columns.forEach((col) =>
        col.forEach((child) => {
          child.id = nanoid(8)
        }),
      )
    }
  }
  return cloned
}

// 복사한 새 이미지 URL로 교체
export const remapImageUrls = (sections: Section[], map: Map<string, string>) => {
  const swap = (url: string) => map.get(url) ?? url
  for (const section of sections) {
    if (section.container?.backgroundImage) {
      section.container.backgroundImage = swap(section.container.backgroundImage)
    }
    if (section.type === 'image' && section.content.src) {
      section.content.src = swap(section.content.src)
    }
    if (section.type === 'gallery') {
      section.content.images.forEach((image) => {
        image.url = swap(image.url)
      })
    }
    if (section.type === 'card') {
      section.content.cards.forEach((card) => {
        card.image = swap(card.image)
      })
    }
    if (section.type === 'columns') {
      section.content.columns.forEach((col) =>
        col.forEach((child) => {
          if (child.type === 'image' && child.content.src) {
            child.content.src = swap(child.content.src)
          }
        }),
      )
    }
  }
}
