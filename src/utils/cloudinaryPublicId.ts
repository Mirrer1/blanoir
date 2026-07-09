// URL에서 public_id 추출
export const publicIdFromUrl = (url: string): string | null => {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-z0-9]+$/i)
  return match ? match[1] : null
}
