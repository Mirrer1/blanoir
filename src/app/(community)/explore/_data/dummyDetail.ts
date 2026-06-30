import { DUMMY_POSTS, type ExplorePost } from './dummyPosts'
import type { Section, TextStyle } from '@/types/section'

export const findDummyPost = (pageId: string): ExplorePost | undefined =>
  DUMMY_POSTS.find((post) => post.pageId === pageId)

// 작성자의 다른 페이지 모음
export const authorOtherPosts = (post: ExplorePost): ExplorePost[] => {
  const mine = DUMMY_POSTS.filter(
    (item) => item.authorHandle === post.authorHandle && item.pageId !== post.pageId,
  )
  if (mine.length > 0) {
    return mine
  }
  return DUMMY_POSTS.filter((item) => item.pageId !== post.pageId)
}

// 인피니티 스크롤용 인기 페이지 피드
export const popularFeed = (post: ExplorePost): ExplorePost[] => {
  const base = [...DUMMY_POSTS]
    .filter((item) => item.pageId !== post.pageId)
    .sort((a, b) => b.likeCount - a.likeCount)
  return [...base, ...base, ...base]
}

// 작성자가 에디터로 쓴 더미 설명 게시글
export const DUMMY_POST_TEXT =
  '직접 만든 페이지예요. 마음에 드시면 템플릿으로 가져가 사진과 문구만 바꿔 쓰셔도 좋아요.\n\n청첩장은 처음 만들어 봤는데 생각보다 쉽게 완성했어요. 봐주셔서 감사하고 다들 좋은 하루 보내세요!'

export const DUMMY_POST_IMAGE = 'https://picsum.photos/seed/post-detail/1200/700'

export interface ExploreReply {
  id: string
  authorName: string
  authorImage: string
  text: string
  createdAt: string
}

export interface ExploreComment extends ExploreReply {
  replies: ExploreReply[]
}

const avatar = (seed: string) => `https://picsum.photos/seed/${seed}/80/80`

export const DUMMY_COMMENTS: ExploreComment[] = [
  {
    id: 'c1',
    authorName: '이수민',
    authorImage: avatar('c-sumin'),
    text: '청첩장 너무 예뻐요! 저도 템플릿으로 써봐도 될까요?',
    createdAt: '2일 전',
    replies: [
      {
        id: 'c1r1',
        authorName: '김준호',
        authorImage: avatar('c-junho'),
        text: '그럼요, 편하게 가져가서 쓰세요 :)',
        createdAt: '1일 전',
      },
    ],
  },
  {
    id: 'c2',
    authorName: '박지훈',
    authorImage: '',
    text: '폰트랑 색 조합이 깔끔하네요. 잘 보고 갑니다.',
    createdAt: '3일 전',
    replies: [],
  },
]

const text = (over: Partial<TextStyle>): TextStyle => ({
  size: 'medium',
  color: '',
  align: 'center',
  bold: false,
  italic: false,
  font: 'pretendard',
  ...over,
})

// 미리보기로 보여줄 더미 완성 페이지 섹션
export const DUMMY_SECTIONS: Section[] = [
  {
    id: 'p1',
    type: 'title',
    content: { text: '준호 ♥ 서연' },
    style: text({ size: 'xlarge', bold: true }),
  },
  {
    id: 'p2',
    type: 'paragraph',
    content: { text: '2026년 5월 16일 토요일 낮 12시\n서울 더채플 웨딩홀 3층' },
    style: text({}),
  },
  {
    id: 'p3',
    type: 'image',
    content: { src: 'https://picsum.photos/seed/wedding-hero/1200/800', alt: '웨딩 사진' },
    style: {
      size: 'large',
      shape: 'rounded',
      align: 'center',
      ratio: 'wide',
      zoom: 1,
      focusX: 50,
      focusY: 50,
    },
  },
  {
    id: 'p4',
    type: 'divider',
    content: {},
    style: { variant: 'solid', thickness: 'thin', color: '' },
  },
  {
    id: 'p5',
    type: 'paragraph',
    content: { text: '두 사람이 사랑으로 하나가 되는 날,\n귀한 걸음으로 축복해 주세요.' },
    style: text({}),
  },
  {
    id: 'p6',
    type: 'image',
    content: { src: 'https://picsum.photos/seed/wedding-2/1000/1000', alt: '커플 사진' },
    style: {
      size: 'medium',
      shape: 'rounded',
      align: 'center',
      ratio: 'square',
      zoom: 1,
      focusX: 50,
      focusY: 50,
    },
  },
  {
    id: 'p7',
    type: 'button',
    content: { text: '오시는 길 보기', url: '#' },
    style: {
      color: '',
      textColor: '',
      shape: 'rounded',
      size: 'medium',
      width: 'auto',
      align: 'center',
    },
  },
]
