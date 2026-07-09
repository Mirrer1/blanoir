// 브라우저별 포맷과 화질을 자동 선택
export const optimizedImageUrl = (url: string): string =>
  url.replace('/upload/', '/upload/f_auto,q_auto/')
