export type TextSize = 'small' | 'medium' | 'large' | 'xlarge'
export type TextAlign = 'left' | 'center' | 'right'

export interface TextStyle {
  size: TextSize
  color: string // 빈 문자열이면 테마 기본색 상속
  align: TextAlign
  bold: boolean
  italic: boolean
  font: string
}

export interface TitleSection {
  id: string
  type: 'title'
  content: { text: string }
  style: TextStyle
}

export interface ParagraphSection {
  id: string
  type: 'paragraph'
  content: { text: string }
  style: TextStyle
}

export type Section = TitleSection | ParagraphSection
export type SectionType = Section['type']
