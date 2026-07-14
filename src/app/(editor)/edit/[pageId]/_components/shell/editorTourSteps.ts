export interface TourStep {
  target?: string
  title: string
  body: string
}

export const EDITOR_TOUR_STEPS: TourStep[] = [
  {
    title: '5분이면 홈페이지 하나 완성',
    body: '빈 페이지로 시작해 공개까지\n만드는 과정을 짧게 보여드릴게요.',
  },
  {
    target: 'add-section',
    title: '섹션 추가와 꾸미기',
    body: '섹션을 추가하고 클릭하면\n스타일 패널에서 글과 색을 바꿔요.',
  },
  {
    target: 'preview',
    title: '미리보기',
    body: '공개하기 전에 실제 화면처럼 미리 확인해요.',
  },
  {
    target: 'publish',
    title: '공개',
    body: '내가 만든 페이지를 다른 사람에게 공개해요.',
  },
  {
    target: 'template',
    title: '더 빠르게',
    body: '템플릿을 사용하면\n더 빠르고 쉽게 시작할 수 있어요.',
  },
]
