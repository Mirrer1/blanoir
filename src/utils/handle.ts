import { customAlphabet } from 'nanoid'

const randomSuffix = customAlphabet('0123456789', 4)

// 이름을 영문 소문자/숫자/언더바 handle로 변환.
// TODO: 한글 로마자 변환과 중복 처리는 Phase 2에서 정교화
export const generateHandle = (name: string) => {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')

  return base || `user_${randomSuffix()}`
}
