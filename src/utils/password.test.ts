import { describe, expect, it } from 'vitest'

import { generateCode } from './password'

describe('generateCode', () => {
  it('6자리 숫자 코드', () => {
    expect(generateCode()).toMatch(/^\d{6}$/)
  })

  it('매번 새 코드 생성', () => {
    const codes = new Set(Array.from({ length: 20 }, () => generateCode()))
    expect(codes.size).toBeGreaterThan(1)
  })
})
