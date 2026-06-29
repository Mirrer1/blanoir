import { useSyncExternalStore } from 'react'

// 페이지별 템플릿 패널 열림 상태 보관
const EVENT = 'blanoir:template-panel'
const keyOf = (pageId: string) => `blanoir:templatePanel:${pageId}`

const subscribe = (onChange: () => void) => {
  window.addEventListener(EVENT, onChange)
  window.addEventListener('storage', onChange)
  return () => {
    window.removeEventListener(EVENT, onChange)
    window.removeEventListener('storage', onChange)
  }
}

// 저장값이 있으면 우선하고 없으면 defaultOpen
const useTemplatePanel = (pageId: string, defaultOpen: boolean) => {
  const stored = useSyncExternalStore(
    subscribe,
    () => window.localStorage.getItem(keyOf(pageId)),
    () => null,
  )
  const open = stored === null ? defaultOpen : stored === 'open'
  const setOpen = (next: boolean) => {
    window.localStorage.setItem(keyOf(pageId), next ? 'open' : 'closed')
    window.dispatchEvent(new Event(EVENT))
  }
  return [open, setOpen] as const
}

export default useTemplatePanel
