// 파일명을 토대로 대체 텍스트 변환
const altFromFileName = (name: string) =>
  name
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .trim()

export default altFromFileName
