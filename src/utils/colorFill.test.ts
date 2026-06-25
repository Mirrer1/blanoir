import { describe, expect, it } from 'vitest'

import { containerBackground, fillBackground, fillText, isGradient } from './colorFill'
import type { Section } from '@/types/section'

const GRADIENT = 'linear-gradient(90deg, #aabbcc, #112233)'

describe('isGradient', () => {
  it('gradient 문자열이면 true', () => {
    expect(isGradient(GRADIENT)).toBe(true)
    expect(isGradient('radial-gradient(#fff, #000)')).toBe(true)
  })

  it('단색이면 false', () => {
    expect(isGradient('#ffffff')).toBe(false)
    expect(isGradient('rgb(0,0,0)')).toBe(false)
  })
})

describe('fillBackground', () => {
  it('단색은 backgroundColor로 적용', () => {
    expect(fillBackground('#ffffff')).toEqual({ backgroundColor: '#ffffff' })
  })

  it('직선 2색 그레디언트는 변수로 분해', () => {
    expect(fillBackground(GRADIENT)).toEqual({
      '--cf-angle': '90deg',
      '--cf-from': '#aabbcc',
      '--cf-to': '#112233',
      backgroundImage: 'linear-gradient(var(--cf-angle), var(--cf-from), var(--cf-to))',
    })
  })

  it('파싱 안 되는 그레디언트는 원본 문자열을 backgroundImage로 폴백', () => {
    const radial = 'radial-gradient(#fff, #000)'
    expect(fillBackground(radial)).toEqual({ backgroundImage: radial })
  })
})

describe('fillText', () => {
  it('단색은 color로 적용', () => {
    expect(fillText('#222222')).toEqual({ color: '#222222' })
  })

  it('그레디언트는 background-clip:text로 글자에 적용', () => {
    expect(fillText(GRADIENT)).toMatchObject({
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      color: 'transparent',
      WebkitTextFillColor: 'transparent',
      '--cf-from': '#aabbcc',
    })
  })
})

describe('containerBackground', () => {
  const base = {
    id: 's1',
    type: 'title',
    content: { text: 'hi' },
    style: { size: 'large', color: '', align: 'center', bold: false, italic: false, font: '' },
  } as const

  const withContainer = (container: Section['container']): Section => ({ ...base, container })

  it('컨테이너 없으면 빈 객체', () => {
    expect(containerBackground(base)).toEqual({})
  })

  it('배경 이미지가 있으면 cover로 적용', () => {
    const style = containerBackground(withContainer({ backgroundImage: 'http://x/a.jpg' }))
    expect(style).toMatchObject({
      backgroundImage: 'url(http://x/a.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    })
  })

  it('배경 이미지 + 단색이면 색도 함께 적용', () => {
    const style = containerBackground(
      withContainer({ backgroundImage: 'http://x/a.jpg', backgroundColor: '#fff' }),
    )
    expect(style.backgroundColor).toBe('#fff')
  })

  it('배경 이미지 + 그레디언트 색이면 backgroundColor는 비움', () => {
    const style = containerBackground(
      withContainer({ backgroundImage: 'http://x/a.jpg', backgroundColor: GRADIENT }),
    )
    expect(style.backgroundColor).toBeUndefined()
  })

  it('이미지 없이 단색만이면 fillBackground 적용', () => {
    expect(containerBackground(withContainer({ backgroundColor: '#eee' }))).toEqual({
      backgroundColor: '#eee',
    })
  })
})
