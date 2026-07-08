import { describe, expect, it } from 'vitest'

import { relativeTime } from './relativeTime'

const now = new Date('2026-07-07T12:00:00Z')
const ago = (ms: number) => new Date(now.getTime() - ms)

describe('relativeTime', () => {
  it('1분 미만은 방금으로 표기한다', () => {
    expect(relativeTime(ago(30 * 1000), now)).toBe('방금')
  })

  it('분·시·일 단위로 전 표기를 만든다', () => {
    expect(relativeTime(ago(5 * 60 * 1000), now)).toBe('5분 전')
    expect(relativeTime(ago(3 * 60 * 60 * 1000), now)).toBe('3시간 전')
    expect(relativeTime(ago(2 * 24 * 60 * 60 * 1000), now)).toBe('2일 전')
  })

  it('ISO 문자열도 받는다', () => {
    expect(relativeTime(ago(24 * 60 * 60 * 1000).toISOString(), now)).toBe('1일 전')
  })
})
