import { useEffect, useRef } from 'react'

import useIsomorphicLayoutEffect from './useIsomorphicLayoutEffect'
import type { ExplorePost } from '@/types/explore'
import {
  type Anchor,
  type ListSnapshot,
  clearListSnapshot,
  saveListSnapshot,
} from '@/utils/listScrollCache'

const RESTORE_WINDOW_MS = 600

const computeAnchor = (scrollEl: HTMLElement): Anchor | null => {
  const containerTop = scrollEl.getBoundingClientRect().top
  let best: Anchor | null = null
  let bestTop = -Infinity
  scrollEl.querySelectorAll<HTMLElement>('[data-pageid]').forEach((el) => {
    const top = el.getBoundingClientRect().top - containerTop
    if (top <= 1 && top > bestTop) {
      bestTop = top
      best = { pageId: el.dataset.pageid ?? '', delta: -top }
    }
  })
  return best
}

// 기준 카드 위치 스크롤 롤백
const applyAnchor = (scrollEl: HTMLElement, anchor: Anchor | null) => {
  if (!anchor) {
    scrollEl.scrollTop = 0
    return
  }
  const el = scrollEl.querySelector<HTMLElement>(`[data-pageid="${CSS.escape(anchor.pageId)}"]`)
  if (!el) {
    return
  }
  const top = el.getBoundingClientRect().top - scrollEl.getBoundingClientRect().top
  scrollEl.scrollTop += top + anchor.delta
}

interface Params {
  filterKey: string
  posts: ExplorePost[]
  hasMore: boolean
  restored: ListSnapshot | null
}

// 목록과 스크롤 위치 저장 후 롤백
const useListScrollRestore = ({ filterKey, posts, hasMore, restored }: Params) => {
  const rootRef = useRef<HTMLDivElement>(null)
  const anchorRef = useRef<Anchor | null>(restored?.anchor ?? null)

  const saveRef = useRef({ filterKey, posts, hasMore })
  useEffect(() => {
    saveRef.current = { filterKey, posts, hasMore }
  })

  useEffect(() => {
    clearListSnapshot()
  }, [])

  // 맨 위 카드를 기준으로 추적
  useEffect(() => {
    const scrollEl = rootRef.current?.closest('main')
    if (!scrollEl) {
      return
    }
    let raf = 0
    const onScroll = () => {
      if (raf) {
        return
      }
      raf = requestAnimationFrame(() => {
        raf = 0
        anchorRef.current = computeAnchor(scrollEl)
      })
    }
    scrollEl.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      scrollEl.removeEventListener('scroll', onScroll)
      if (raf) {
        cancelAnimationFrame(raf)
      }
    }
  }, [])

  // 목록과 스크롤 기준 저장
  useEffect(() => {
    return () => {
      saveListSnapshot({ ...saveRef.current, anchor: anchorRef.current })
    }
  }, [])

  // 기준 카드로 스크롤 포커싱
  useIsomorphicLayoutEffect(() => {
    if (!restored) {
      return
    }
    const scrollEl = rootRef.current?.closest('main')
    if (!(scrollEl instanceof HTMLElement)) {
      return
    }
    applyAnchor(scrollEl, restored.anchor)
    let active = true
    const start = performance.now()
    const stop = () => {
      active = false
    }
    const tick = () => {
      if (!active) {
        return
      }
      applyAnchor(scrollEl, restored.anchor)
      if (performance.now() - start < RESTORE_WINDOW_MS) {
        requestAnimationFrame(tick)
      }
    }
    requestAnimationFrame(tick)
    scrollEl.addEventListener('wheel', stop, { passive: true, once: true })
    scrollEl.addEventListener('touchstart', stop, { passive: true, once: true })
    scrollEl.addEventListener('keydown', stop, { once: true })
    return () => {
      active = false
      scrollEl.removeEventListener('wheel', stop)
      scrollEl.removeEventListener('touchstart', stop)
      scrollEl.removeEventListener('keydown', stop)
    }
  }, [restored])

  return rootRef
}

export default useListScrollRestore
