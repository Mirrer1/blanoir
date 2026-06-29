import { describe, expect, it } from 'vitest'

import { makeCopyTitle } from './copyTitle'

describe('makeCopyTitle', () => {
  it('제목이 있으면 - 복사본을 붙임', () => {
    expect(makeCopyTitle('내 가게', new Set(['내 가게']))).toBe('내 가게 - 복사본')
  })

  it('같은 복사본이 있으면 번호를 붙여 증가', () => {
    expect(makeCopyTitle('내 가게', new Set(['내 가게', '내 가게 - 복사본']))).toBe(
      '내 가게 - 복사본(2)',
    )
    expect(
      makeCopyTitle('내 가게', new Set(['내 가게', '내 가게 - 복사본', '내 가게 - 복사본(2)'])),
    ).toBe('내 가게 - 복사본(3)')
  })

  it('이미 복사본 표기가 붙은 제목은 기준을 복원해 번호만 증가', () => {
    expect(makeCopyTitle('내 가게 - 복사본', new Set(['내 가게 - 복사본']))).toBe(
      '내 가게 - 복사본(2)',
    )
    expect(
      makeCopyTitle('내 가게 - 복사본(2)', new Set(['내 가게 - 복사본', '내 가게 - 복사본(2)'])),
    ).toBe('내 가게 - 복사본(3)')
  })

  it('제목이 없으면 복사본만 사용', () => {
    expect(makeCopyTitle('', new Set(['']))).toBe('복사본')
    expect(makeCopyTitle('', new Set(['', '복사본']))).toBe('복사본(2)')
  })

  it('복사본 표기만 있던 제목도 기준 없는 복사본으로 처리', () => {
    expect(makeCopyTitle('복사본', new Set(['복사본']))).toBe('복사본(2)')
  })

  it('앞뒤 공백은 무시', () => {
    expect(makeCopyTitle('  내 가게  ', new Set<string>())).toBe('내 가게 - 복사본')
  })
})
