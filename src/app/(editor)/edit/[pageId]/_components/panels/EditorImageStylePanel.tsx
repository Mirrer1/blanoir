'use client'

import { Info } from 'lucide-react'

import { SEG_BASE, SEG_OFF, SEG_ON } from '../../controlStyles'
import EditorAlignField from './EditorAlignField'
import EditorImageField from './EditorImageField'
import EditorStyleField from './EditorStyleField'
import { deleteImage } from '@/actions/upload'
import { cn } from '@/lib/utils'
import useEditorStore from '@/store/editor'
import type { ImageRatio, ImageSection, ImageShape, ImageSize } from '@/types/section'

const SIZE_OPTIONS: { value: ImageSize; label: string }[] = [
  { value: 'small', label: '작게' },
  { value: 'medium', label: '보통' },
  { value: 'large', label: '크게' },
]
const SHAPE_OPTIONS: { value: ImageShape; label: string }[] = [
  { value: 'square', label: '사각' },
  { value: 'rounded', label: '둥근' },
  { value: 'circle', label: '원형' },
]
const RATIO_OPTIONS: { value: ImageRatio; label: string }[] = [
  { value: 'original', label: '원본' },
  { value: 'square', label: '정사각형' },
  { value: 'wide', label: '와이드' },
]

const EditorImageStylePanel = ({ section }: { section: ImageSection }) => {
  const updateSectionContent = useEditorStore((s) => s.updateSectionContent)
  const updateSectionStyle = useEditorStore((s) => s.updateSectionStyle)
  const { src, alt } = section.content
  const { size, shape, align, ratio, zoom } = section.style

  const handleChange = (uploaded: { url: string; alt: string }) => {
    const oldSrc = src
    updateSectionContent(section.id, { src: uploaded.url, alt: uploaded.alt })
    if (oldSrc) {
      void deleteImage(oldSrc)
    }
  }

  const handleRemove = () => {
    if (src) {
      void deleteImage(src)
    }
    updateSectionContent(section.id, { src: '' })
  }

  return (
    <>
      <EditorImageField
        label="이미지"
        url={src}
        alt={alt}
        onChange={handleChange}
        onRemove={handleRemove}
      />

      <EditorStyleField label="크기">
        <div className="flex gap-1">
          {SIZE_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => updateSectionStyle(section.id, { size: option.value })}
              className={cn(SEG_BASE, 'flex-1', size === option.value ? SEG_ON : SEG_OFF)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </EditorStyleField>

      <EditorStyleField label="모양">
        <div className="flex gap-1">
          {SHAPE_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => updateSectionStyle(section.id, { shape: option.value })}
              className={cn(SEG_BASE, 'flex-1', shape === option.value ? SEG_ON : SEG_OFF)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </EditorStyleField>

      <EditorAlignField
        align={align}
        onChange={(value) => updateSectionStyle(section.id, { align: value })}
      />

      <EditorStyleField label="비율">
        <div className="flex flex-wrap gap-1">
          {RATIO_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => updateSectionStyle(section.id, { ratio: option.value })}
              className={cn(SEG_BASE, 'flex-1', ratio === option.value ? SEG_ON : SEG_OFF)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </EditorStyleField>

      <EditorStyleField label="확대">
        <input
          type="range"
          min={1}
          max={3}
          step={0.1}
          value={zoom}
          onChange={(e) => updateSectionStyle(section.id, { zoom: Number(e.target.value) })}
          className="accent-foreground w-full cursor-pointer"
        />
        <p className="text-muted-foreground flex items-center gap-1.5 text-xs leading-none">
          <Info className="size-3.5 shrink-0" />
          <span>확대한 뒤 이미지를 드래그해 보일 부분을 정하세요.</span>
        </p>
      </EditorStyleField>
    </>
  )
}

export default EditorImageStylePanel
