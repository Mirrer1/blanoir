import type { Section } from '@/types/section'

// 메타 description
export const firstParagraphText = (sections: Section[]) => {
  const para = sections.find((s) => s.type === 'paragraph' && s.content.text.trim())
  return para?.type === 'paragraph' ? para.content.text.trim().slice(0, 150) : ''
}

// 첫 이미지, og:image
export const firstImageUrl = (sections: Section[]) => {
  for (const section of sections) {
    if (section.type === 'image' && section.content.src) {
      return section.content.src
    }
    if (section.type === 'gallery' && section.content.images[0]?.url) {
      return section.content.images[0].url
    }
    if (section.type === 'card') {
      const card = section.content.cards.find((c) => c.image)
      if (card) {
        return card.image
      }
    }
  }
  return ''
}
