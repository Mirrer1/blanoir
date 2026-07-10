// 이미 붙은 변환 세그먼트 판별용
const TRANSFORM_SEGMENT = /\/upload\/[a-z]+_[^/]+\//

// 표시 크기에 맞춰 포맷·화질·너비 자동 변환
export const optimizedImageUrl = (url: string, width?: number): string => {
  if (!url.includes('/upload/')) {
    return url
  }
  const transform = width ? `f_auto,q_auto,w_${width}` : 'f_auto,q_auto'
  if (TRANSFORM_SEGMENT.test(url)) {
    return url.replace(TRANSFORM_SEGMENT, `/upload/${transform}/`)
  }
  return url.replace('/upload/', `/upload/${transform}/`)
}
