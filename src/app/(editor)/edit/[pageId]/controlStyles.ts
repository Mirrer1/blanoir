// 스타일 패널 버튼 공통 클래스
export const SEG_BASE = 'cursor-pointer rounded-md border px-2 py-1.5 text-xs transition-colors'
export const SEG_ON = 'bg-foreground text-background border-foreground'
export const SEG_OFF = 'text-foreground hover:bg-muted'
export const ICON_BASE =
  'flex size-8 cursor-pointer items-center justify-center rounded-md border transition-colors'

// 드래그 정렬 시 주변 요소가 부드럽게 자리를 내주는 트랜지션
export const SORTABLE_TRANSITION = { duration: 320, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }

// 섹션 배경색/그레디언트 부드럽게 전환
export const COLOR_TRANSITION =
  'background-color 200ms ease, --cf-from 200ms ease, --cf-to 200ms ease, --cf-angle 200ms ease'
