import { describe, expect, it } from 'vitest'

import { generateHandle } from './handle'

describe('generateHandle', () => {
  it('한글 닉네임을 로마자 소문자 handle로 변환', () => {
    expect(generateHandle('홍길동')).toBe('honggildong')
    expect(generateHandle('김민준')).toBe('gimminjun')
  })

  it('영문은 소문자로 그대로 유지', () => {
    expect(generateHandle('Test')).toBe('test')
  })

  it('공백·특수문자는 언더바로 합치고 앞뒤 언더바는 제거', () => {
    expect(generateHandle('한글 이름')).toBe('hangeul_ireum')
    expect(generateHandle('  hello world  ')).toBe('hello_world')
    expect(generateHandle('a@@@b')).toBe('a_b')
  })

  it('숫자는 유지', () => {
    expect(generateHandle('민준2')).toBe('minjun2')
  })

  it('변환 결과가 비면 user_XXXX 폴백', () => {
    expect(generateHandle('!!!')).toMatch(/^user_\d{4}$/)
    expect(generateHandle('')).toMatch(/^user_\d{4}$/)
  })
})
