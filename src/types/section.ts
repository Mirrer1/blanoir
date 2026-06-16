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

export type DividerVariant = 'solid' | 'dashed' | 'dotted'
export type DividerThickness = 'thin' | 'medium' | 'thick'

export interface DividerStyle {
  variant: DividerVariant
  thickness: DividerThickness
  color: string // 빈 문자열이면 기본 보더색
}

export interface DividerSection {
  id: string
  type: 'divider'
  content: Record<string, never>
  style: DividerStyle
}

export type ImageSize = 'small' | 'medium' | 'large'
export type ImageShape = 'square' | 'rounded' | 'circle'

export interface ImageStyle {
  size: ImageSize
  shape: ImageShape
  align: TextAlign
}

export interface ImageSection {
  id: string
  type: 'image'
  content: { src: string; alt: string }
  style: ImageStyle
}

export type ButtonShape = 'square' | 'rounded'
export type ButtonSize = 'small' | 'medium' | 'large'
export type ButtonWidth = 'auto' | 'wide' | 'full'

export interface ButtonStyle {
  color: string // 빈 문자열이면 기본 버튼색
  shape: ButtonShape
  size: ButtonSize
  width: ButtonWidth
  align: TextAlign
}

export interface ButtonSection {
  id: string
  type: 'button'
  content: { text: string; url: string }
  style: ButtonStyle
}

export type Section =
  | TitleSection
  | ParagraphSection
  | DividerSection
  | ButtonSection
  | ImageSection
export type SectionType = Section['type']
export type SectionStyle = Section['style']
