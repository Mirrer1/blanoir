// 복사본 표기를 붙이되 이미 붙어 있으면 기준 제목을 복원해 번호만 증가
export const makeCopyTitle = (sourceTitle: string, existing: Set<string>): string => {
  let base = sourceTitle.trim().replace(/ - 복사본(\(\d+\))?$/, '')
  if (/^복사본(\(\d+\))?$/.test(base)) {
    base = ''
  }
  const root = base ? `${base} - 복사본` : '복사본'
  if (!existing.has(root)) {
    return root
  }
  let count = 2
  while (existing.has(`${root}(${count})`)) {
    count++
  }
  return `${root}(${count})`
}
