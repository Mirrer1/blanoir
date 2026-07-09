import { describe, expect, it } from 'vitest'

import { optimizedImageUrl } from './cloudinaryOptimize'

describe('optimizedImageUrl', () => {
  it('버전 세그먼트가 있는 URL에 변환 파라미터 삽입', () => {
    const url = 'https://res.cloudinary.com/demo/image/upload/v1234567890/blanoir/u1/a.jpg'
    expect(optimizedImageUrl(url)).toBe(
      'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto/v1234567890/blanoir/u1/a.jpg',
    )
  })

  it('버전 세그먼트가 없는 URL에도 변환 파라미터 삽입', () => {
    const url = 'https://res.cloudinary.com/demo/image/upload/blanoir/u1/a.png'
    expect(optimizedImageUrl(url)).toBe(
      'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto/blanoir/u1/a.png',
    )
  })

  it('/upload/ 세그먼트가 없으면 원본 그대로 반환', () => {
    const url = 'https://example.com/a.jpg'
    expect(optimizedImageUrl(url)).toBe(url)
  })
})
