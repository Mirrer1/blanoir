import { useSyncExternalStore } from 'react'

// 두 패널 동시 표시 경계 1800px
const QUERY = '(min-width: 1800px)'

const subscribe = (onChange: () => void) => {
  const mq = window.matchMedia(QUERY)
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

const getSnapshot = () => window.matchMedia(QUERY).matches
const getServerSnapshot = () => true
const useDualPanel = () => useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

export default useDualPanel
