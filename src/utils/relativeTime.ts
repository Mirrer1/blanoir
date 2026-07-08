// 절대 시각을 한국어 상대 시각 문자열로 변환
const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 365 * 24 * 60 * 60 * 1000],
  ['month', 30 * 24 * 60 * 60 * 1000],
  ['day', 24 * 60 * 60 * 1000],
  ['hour', 60 * 60 * 1000],
  ['minute', 60 * 1000],
]

const formatter = new Intl.RelativeTimeFormat('ko', { numeric: 'always' })

export function relativeTime(date: Date | string, now: Date = new Date()): string {
  const target = typeof date === 'string' ? new Date(date) : date
  const diff = target.getTime() - now.getTime()

  // 1분 미만은 단위 없이 방금으로 표기
  if (Math.abs(diff) < 60 * 1000) {
    return '방금'
  }
  for (const [unit, ms] of UNITS) {
    if (Math.abs(diff) >= ms) {
      return formatter.format(Math.round(diff / ms), unit)
    }
  }
  return '방금'
}
