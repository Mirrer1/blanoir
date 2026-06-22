import { useSyncExternalStore } from 'react'

// 태블릿·모바일 경계 1024px
const QUERY = '(max-width: 1023px)'

const subscribe = (onChange: () => void) => {
  const mq = window.matchMedia(QUERY)
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

const getSnapshot = () => window.matchMedia(QUERY).matches

// 서버는 화면 폭을 몰라 데스크톱으로 간주
const getServerSnapshot = () => false

const useIsSmallScreen = () => useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

export default useIsSmallScreen
