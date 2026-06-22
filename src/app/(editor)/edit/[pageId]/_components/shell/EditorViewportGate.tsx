'use client'

import EditorMobilePreview from './EditorMobilePreview'
import EditorShell from './EditorShell'
import useIsSmallScreen from '@/hooks/useIsSmallScreen'

// PC는 편집, 태블릿/모바일은 미리보기 전용으로 분기
const EditorViewportGate = () => {
  const isSmallScreen = useIsSmallScreen()

  return <>{isSmallScreen ? <EditorMobilePreview /> : <EditorShell />}</>
}

export default EditorViewportGate
