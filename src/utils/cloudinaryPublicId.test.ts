import { describe, expect, it } from 'vitest'

import { publicIdFromUrl } from './cloudinaryPublicId'

describe('publicIdFromUrl', () => {
  it('버전 세그먼트가 있는 URL에서 public_id를 추출', () => {
    const url = 'https://res.cloudinary.com/demo/image/upload/v1234567890/blanoir/u1/abc123.jpg'
    expect(publicIdFromUrl(url)).toBe('blanoir/u1/abc123')
  })

  it('버전 세그먼트가 없는 URL에서도 public_id를 추출', () => {
    const url = 'https://res.cloudinary.com/demo/image/upload/blanoir/u1/abc123.png'
    expect(publicIdFromUrl(url)).toBe('blanoir/u1/abc123')
  })

  it('/upload/ 세그먼트가 없으면 null', () => {
    expect(publicIdFromUrl('https://example.com/blanoir/u1/abc123.jpg')).toBeNull()
  })

  it('확장자가 없으면 null', () => {
    expect(
      publicIdFromUrl('https://res.cloudinary.com/demo/image/upload/blanoir/u1/abc123'),
    ).toBeNull()
  })
})
