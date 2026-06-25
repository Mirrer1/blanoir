import { romanize } from 'es-hangul'
import { customAlphabet } from 'nanoid'

const randomSuffix = customAlphabet('0123456789', 4)

// 닉네임을 영문 소문자/숫자/언더바 handle로 변환. 한글은 로마자로 음역
export const generateHandle = (name: string) => {
  const base = romanize(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')

  return base || `user_${randomSuffix()}`
}
