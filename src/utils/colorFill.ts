import type { CSSProperties } from 'react'

import type { Section } from '@/types/section'

// 그레디언트 값은 CSS gradient 문자열로 저장
export const isGradient = (value: string) => value.includes('gradient')

const LINEAR =
  /^linear-gradient\(\s*(\d+)deg\s*,\s*(#[0-9a-fA-F]{3,8})\s*,\s*(#[0-9a-fA-F]{3,8})\s*\)$/

// 직선 2색 그레디언트를 색과 각도 변수로 분해
const gradientVars = (value: string): CSSProperties | null => {
  const match = value.match(LINEAR)
  if (!match) {
    return null
  }
  return {
    '--cf-angle': `${match[1]}deg`,
    '--cf-from': match[2],
    '--cf-to': match[3],
    backgroundImage: 'linear-gradient(var(--cf-angle), var(--cf-from), var(--cf-to))',
  } as CSSProperties
}

// 색을 배경으로 적용
export const fillBackground = (value: string): CSSProperties =>
  isGradient(value)
    ? (gradientVars(value) ?? { backgroundImage: value })
    : { backgroundColor: value }

// 색을 글자색으로 적용
export const fillText = (value: string): CSSProperties => {
  if (!isGradient(value)) {
    return { color: value }
  }
  return {
    ...(gradientVars(value) ?? { backgroundImage: value }),
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    WebkitTextFillColor: 'transparent',
  }
}

// 섹션 박스 배경 칠을 에디터와 공개에서 공유
// 높이는 콘텐츠 칸 minHeight로 별도로 처리
export const containerBackground = (section: Section): CSSProperties => {
  const container = section.container
  const color = container?.backgroundColor || ''
  const url = container?.backgroundImage || ''

  // 업로드 이미지가 있으면 backgroundImage 슬롯 차지
  if (url) {
    return {
      backgroundColor: color && !isGradient(color) ? color : undefined,
      backgroundImage: `url(${url})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }
  }
  // 색은 fillBackground로 처리
  return color ? fillBackground(color) : {}
}
