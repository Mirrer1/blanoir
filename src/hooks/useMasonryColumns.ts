import { useSyncExternalStore } from 'react'

// 브레이크포인트 경계 메이슨리 컬럼 수
const WIDE = '(min-width: 1024px)'
const MEDIUM = '(min-width: 640px)'

const subscribe = (onChange: () => void) => {
  const mqs = [window.matchMedia(WIDE), window.matchMedia(MEDIUM)]
  mqs.forEach((mq) => mq.addEventListener('change', onChange))
  return () => mqs.forEach((mq) => mq.removeEventListener('change', onChange))
}

const getSnapshot = () =>
  window.matchMedia(WIDE).matches ? 3 : window.matchMedia(MEDIUM).matches ? 2 : 1

// 서버는 데스크톱 3열
const getServerSnapshot = () => 3

const useMasonryColumns = () => useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

export default useMasonryColumns
