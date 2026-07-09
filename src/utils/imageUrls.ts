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
  if (section.type === 'columns') {
    section.content.columns.forEach((col) =>
      col.forEach((child) => {
        if (child.type === 'image' && child.content.src) {
          urls.push(child.content.src)
        }
      }),
    )
  }
  return urls
}

// 둘러보기 대표 이미지와 게시글 이미지 URL 수집
export const communityImageUrls = (page: {
  communityImage?: string
  communityPost?: string
}): string[] => {
  const urls: string[] = []
  if (page.communityImage) {
    urls.push(page.communityImage)
  }
  if (page.communityPost) {
    for (const match of page.communityPost.matchAll(/<img[^>]*\ssrc="([^"]+)"/g)) {
      urls.push(match[1])
    }
  }
  return urls
}
