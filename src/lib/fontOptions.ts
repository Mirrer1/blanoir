export interface FontOption {
  value: string
  label: string
  cssVar: string
}

export const FONT_OPTIONS: FontOption[] = [
  { value: 'pretendard', label: '프리텐다드', cssVar: 'var(--font-sans)' },
  { value: 'noto-sans-kr', label: '노토산스', cssVar: 'var(--font-noto-sans-kr)' },
  { value: 'nanum-gothic', label: '나눔고딕', cssVar: 'var(--font-nanum-gothic)' },
  { value: 'nanum-myeongjo', label: '나눔명조', cssVar: 'var(--font-nanum-myeongjo)' },
  { value: 'gowun-dodum', label: '고운돋움', cssVar: 'var(--font-gowun-dodum)' },
  { value: 'gowun-batang', label: '고운바탕', cssVar: 'var(--font-gowun-batang)' },
]

const FONT_VAR_MAP = Object.fromEntries(FONT_OPTIONS.map((f) => [f.value, f.cssVar]))

export const fontFamilyOf = (font: string) => FONT_VAR_MAP[font] ?? FONT_VAR_MAP.pretendard
