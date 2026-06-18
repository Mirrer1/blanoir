import type { ReactNode } from 'react'

// 공개 페이지는 방문자 테마와 무관하게 항상 라이트 테마
const PublicLayout = ({ children }: { children: ReactNode }) => (
  <div className="canvas-light text-foreground bg-background min-h-screen">{children}</div>
)

export default PublicLayout
