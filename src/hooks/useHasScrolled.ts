import { useSyncExternalStore } from 'react'

const THRESHOLD = 600

// 실제 스크롤 컨테이너
const getMain = () => document.querySelector('main')

const subscribe = (onChange: () => void) => {
  const main = getMain()
  if (!main) {
    return () => {}
  }
  main.addEventListener('scroll', onChange)
  return () => main.removeEventListener('scroll', onChange)
}

const getSnapshot = () => (getMain()?.scrollTop ?? 0) > THRESHOLD

// 서버에서 스크롤 위치 숨김처리
const getServerSnapshot = () => false

const useHasScrolled = () => useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

export default useHasScrolled
