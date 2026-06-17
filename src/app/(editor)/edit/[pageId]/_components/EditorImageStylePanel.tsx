'use client'

import { Info, Loader2, Upload, X } from 'lucide-react'
import { useRef } from 'react'

import { SEG_BASE, SEG_OFF, SEG_ON } from '../controlStyles'
import EditorAlignField from './EditorAlignField'
import EditorStyleField from './EditorStyleField'
import EditorTooltip from './EditorTooltip'
import { deleteImage } from '@/actions/upload'
import useImageUpload from '@/hooks/useImageUpload'
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
  const { isUploading, uploadOne } = useImageUpload()
  const inputRef = useRef<HTMLInputElement>(null)
  const { src, alt } = section.content
  const { size, shape, align, ratio, zoom } = section.style

  const openPicker = () => inputRef.current?.click()

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0]
    e.target.value = ''
    if (!picked) {
      return
    }
    const oldSrc = src
    const uploaded = await uploadOne(picked)
    if (!uploaded) {
      return
    }
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
      <EditorStyleField label="이미지">
        <div className="bg-muted relative overflow-hidden rounded-lg border">
          <img src={src} alt={alt} className="aspect-video w-full object-cover" />
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <Loader2 className="size-5 animate-spin text-white" />
            </div>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
        <div className="flex justify-end gap-1">
          <EditorTooltip label="이미지 교체">
            <button
              aria-label="이미지 교체"
              onClick={openPicker}
              className="text-muted-foreground hover:bg-muted hover:text-foreground flex size-7 cursor-pointer items-center justify-center rounded-md"
            >
              <Upload className="size-4" />
            </button>
          </EditorTooltip>
          <EditorTooltip label="이미지 제거">
            <button
              aria-label="이미지 제거"
              onClick={handleRemove}
              className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive flex size-7 cursor-pointer items-center justify-center rounded-md"
            >
              <X className="size-4" />
            </button>
          </EditorTooltip>
        </div>
      </EditorStyleField>

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
