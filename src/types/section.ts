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
export type ImageRatio = 'original' | 'square' | 'wide'

export interface ImageStyle {
  size: ImageSize
  shape: ImageShape
  align: TextAlign // 박스가 섹션보다 좁을 때 가로 위치
  ratio: ImageRatio // 박스 비율, 이미지는 항상 cover
  zoom: number // 1배(Default), 3배(Max)
  focusX: number // 초점 가로 위치 0~100%
  focusY: number // 초점 세로 위치 0~100%
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
  color: string // 배경색, 빈 문자열이면 기본(--foreground)
  textColor: string // 글자색, 빈 문자열이면 기본(--background)
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

export type GalleryGap = 'none' | 'small' | 'medium' | 'large'

export interface GalleryStyle {
  displayMode: 'grid'
  size: ImageSize
  shape: ImageShape
  gap: GalleryGap
}

export interface GalleryImage {
  url: string
  alt: string
}

export interface GallerySection {
  id: string
  type: 'gallery'
  content: { images: GalleryImage[] }
  style: GalleryStyle
}

export type CardLayout = 'vertical' | 'horizontal' | 'grid'
export type CardColumns = 2 | 3 | 4

export interface CardStyle {
  layout: CardLayout
  columns: CardColumns // 그리드일 때 한 줄 카드 수
  align: TextAlign
}

export interface CardItem {
  id: string
  image: string
  alt: string
  title: string
  description: string
}

export interface CardSection {
  id: string
  type: 'card'
  content: { cards: CardItem[] }
  style: CardStyle
}

export type Section =
  | TitleSection
  | ParagraphSection
  | DividerSection
  | ButtonSection
  | ImageSection
  | GallerySection
  | CardSection
export type SectionType = Section['type']
export type SectionStyle = Section['style']
