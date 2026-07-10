// URL에서 public_id 추출
export const publicIdFromUrl = (url: string): string | null => {
  const match = url.match(/\/upload\/(.+)\.[a-z0-9]+$/i)
  if (!match) {
    return null
  }
  const segments = match[1].split('/')
  // 변환 세그먼트 제거
  while (
    segments.length > 1 &&
    (segments[0].includes(',') || /^[a-z]+_[^/]+$/i.test(segments[0]))
  ) {
    segments.shift()
  }
  // 버전 세그먼트 제거
  if (segments.length > 1 && /^v\d+$/.test(segments[0])) {
    segments.shift()
  }
  return segments.join('/')
}
