'use client'

import EditorMobilePreview from './EditorMobilePreview'
import EditorShell from './EditorShell'
import useIsSmallScreen from '@/hooks/useIsSmallScreen'

// PC는 편집하고 작은 화면은 미리보기 전용으로 분기
const EditorViewportGate = () => {
  const isSmallScreen = useIsSmallScreen()

  return <>{isSmallScreen ? <EditorMobilePreview /> : <EditorShell />}</>
}

export default EditorViewportGate
