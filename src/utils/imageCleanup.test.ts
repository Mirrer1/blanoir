import { describe, expect, it } from 'vitest'

import { findOrphanPublicIds } from './imageCleanup'
import type { CloudinaryResourceInfo } from './imageCleanup'

const HOUR = 60 * 60 * 1000
const now = new Date('2026-07-09T00:00:00Z')

const resource = (publicId: string, hoursAgo: number): CloudinaryResourceInfo => ({
  publicId,
  createdAt: new Date(now.getTime() - hoursAgo * HOUR).toISOString(),
})

describe('findOrphanPublicIds', () => {
  it('DB에 참조 없고 유예 기간 지난 이미지만 고아로 판단', () => {
    const resources = [resource('blanoir/u1/a', 48), resource('blanoir/u1/b', 48)]
    const inUse = new Set(['blanoir/u1/b'])
    expect(findOrphanPublicIds(resources, inUse, now, 24 * HOUR)).toEqual(['blanoir/u1/a'])
  })

  it('유예 기간 안 지난 이미지는 참조 없어도 제외', () => {
    const resources = [resource('blanoir/u1/a', 1)]
    expect(findOrphanPublicIds(resources, new Set(), now, 24 * HOUR)).toEqual([])
  })

  it('참조 중인 이미지는 오래됐어도 제외', () => {
    const resources = [resource('blanoir/u1/a', 100)]
    const inUse = new Set(['blanoir/u1/a'])
    expect(findOrphanPublicIds(resources, inUse, now, 24 * HOUR)).toEqual([])
  })

  it('고아가 없으면 빈 배열', () => {
    expect(findOrphanPublicIds([], new Set(), now, 24 * HOUR)).toEqual([])
  })
})
