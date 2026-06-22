import type { Target } from 'motion/react'

import type { SectionAnimation } from '@/types/section'

// 등장 애니메이션의 시작 상태
const ANIMATION_FROM: Record<Exclude<SectionAnimation, 'none'>, Target> = {
  up: { opacity: 0, y: 32 },
  down: { opacity: 0, y: -32 },
  left: { opacity: 0, x: -32 },
  right: { opacity: 0, x: 32 },
  fade: { opacity: 0 },
  zoom: { opacity: 0, scale: 0.92 },
  blur: { opacity: 0, filter: 'blur(10px)' },
}

// 시작 상태에서 보이는 기본 상태로 롤백
export const ANIMATION_TO: Target = {
  opacity: 1,
  x: 0,
  y: 0,
  scale: 1,
  rotate: 0,
  filter: 'blur(0px)',
}

export const revealMotionFrom = (animation: SectionAnimation | undefined): Target | null =>
  animation && animation !== 'none' ? ANIMATION_FROM[animation] : null
