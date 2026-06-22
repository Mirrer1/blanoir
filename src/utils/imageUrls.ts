import type { Section } from '@/types/section'

// 섹션에서 쓰던 이미지 URL 수집
export const sectionImageUrls = (section: Section): string[] => {
  const urls: string[] = []
  if (section.container?.backgroundImage) {
    urls.push(section.container.backgroundImage)
  }
  if (section.type === 'image' && section.content.src) {
    urls.push(section.content.src)
  }
  if (section.type === 'card') {
    section.content.cards.forEach((card) => card.image && urls.push(card.image))
  }
  if (section.type === 'gallery') {
    section.content.images.forEach((image) => image.url && urls.push(image.url))
  }
  return urls
}
