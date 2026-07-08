import { useLayoutEffect, useRef } from 'react'

// 조건부 마운트 대응위해 렌더 높이 내용에 맞춰 재측정
export function useAutoResizeTextarea() {
  const ref = useRef<HTMLTextAreaElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) {
      return
    }
    el.style.height = 'auto'
    const { borderTopWidth, borderBottomWidth } = getComputedStyle(el)
    const border = parseFloat(borderTopWidth) + parseFloat(borderBottomWidth)
    el.style.height = `${el.scrollHeight + border}px`
  })

  return ref
}
