import SectionButton from './SectionButton'
import SectionImageView from './SectionImageView'
import SectionParagraphView from './SectionParagraphView'
import SectionTitleView from './SectionTitleView'
import type { ColumnChild } from '@/types/section'

// 열 칸 한 블록의 표시 마크업으로 공개와 에디터 비선택 셀이 공유
const ColumnChildView = ({ child, live = false }: { child: ColumnChild; live?: boolean }) => {
  if (child.type === 'title') {
    return <SectionTitleView section={child} live={live} />
  }
  if (child.type === 'paragraph') {
    return <SectionParagraphView section={child} live={live} />
  }
  if (child.type === 'button') {
    return <SectionButton section={child} live={live} />
  }
  // 일반 이미지와 동일하게 표시
  return <SectionImageView section={child} live={live} />
}

export default ColumnChildView
