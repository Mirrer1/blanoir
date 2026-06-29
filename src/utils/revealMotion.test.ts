import { describe, expect, it } from 'vitest'

import { revealMotionFrom } from './revealMotion'

describe('revealMotionFrom', () => {
  it('none·undefined는 null', () => {
    expect(revealMotionFrom('none')).toBeNull()
    expect(revealMotionFrom(undefined)).toBeNull()
  })

  it('방향 효과는 축 이동 + 투명도', () => {
    expect(revealMotionFrom('up')).toEqual({ opacity: 0, y: 32 })
    expect(revealMotionFrom('down')).toEqual({ opacity: 0, y: -32 })
    expect(revealMotionFrom('left')).toEqual({ opacity: 0, x: -32 })
    expect(revealMotionFrom('right')).toEqual({ opacity: 0, x: 32 })
  })

  it('페이드·확대·블러는 각 속성', () => {
    expect(revealMotionFrom('fade')).toEqual({ opacity: 0 })
    expect(revealMotionFrom('zoom')).toEqual({ opacity: 0, scale: 0.92 })
    expect(revealMotionFrom('blur')).toEqual({ opacity: 0, filter: 'blur(10px)' })
  })
})
