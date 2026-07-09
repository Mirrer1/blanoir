import type { Section } from '@/types/section'

// 메타 description
export const firstParagraphText = (sections: Section[]) => {
  const para = sections.find((s) => s.type === 'paragraph' && s.content.text.trim())
  return para?.type === 'paragraph' ? para.content.text.trim().slice(0, 150) : ''
}

// 소개글 HTML에서 메타 description 추출
export const textFromHtml = (html: string) =>
  html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 150)

// 이미지 없을 때 썸네일 대체용 첫 텍스트
export const firstTextContent = (sections: Section[]) => {
  const text = sections.find(
    (s) => (s.type === 'title' || s.type === 'paragraph') && s.content.text.trim(),
  )
  return text?.type === 'title' || text?.type === 'paragraph'
    ? text.content.text.trim().slice(0, 80)
    : ''
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
    if (section.type === 'columns') {
      for (const col of section.content.columns) {
        for (const child of col) {
          if (child.type === 'image' && child.content.src) {
            return child.content.src
          }
        }
      }
    }
  }
  return ''
}
