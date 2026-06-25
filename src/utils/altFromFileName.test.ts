import { describe, expect, it } from 'vitest'

import altFromFileName from './altFromFileName'

describe('altFromFileName', () => {
  it('확장자 제거', () => {
    expect(altFromFileName('photo.jpg')).toBe('photo')
    expect(altFromFileName('cover.png')).toBe('cover')
  })

  it('하이픈·언더바를 공백으로 변환', () => {
    expect(altFromFileName('my-cool_image.webp')).toBe('my cool image')
    expect(altFromFileName('a__b--c.png')).toBe('a b c')
  })

  it('앞뒤 공백 정리', () => {
    expect(altFromFileName('_photo_.jpg')).toBe('photo')
  })

  it('마지막 점만 확장자로 보고 앞쪽 점은 유지', () => {
    expect(altFromFileName('my.photo.final.jpg')).toBe('my.photo.final')
  })
})
