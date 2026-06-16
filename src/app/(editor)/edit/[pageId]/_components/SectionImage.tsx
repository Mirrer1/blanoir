'use client'

import { ImagePlus, Loader2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import { SEG_BASE, SEG_OFF } from '../controlStyles'
import { deleteImage, uploadImage } from '@/actions/upload'
import { cn } from '@/lib/utils'
import useEditorStore from '@/store/editor'
import type { ImageSection } from '@/types/section'

const MAX_BYTES = 5 * 1024 * 1024

const SIZE_CLASS = { small: 'max-w-xs', medium: 'max-w-md', large: 'max-w-full' } as const
const SHAPE_WRAP = {
  square: 'rounded-none',
  rounded: 'rounded-xl',
  circle: 'aspect-square rounded-full',
} as const
const SHAPE_IMG = { square: '', rounded: '', circle: 'h-full object-cover' } as const
const JUSTIFY_CLASS = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
} as const

const SectionImage = ({ section, isSelected }: { section: ImageSection; isSelected: boolean }) => {
  const updateSectionContent = useEditorStore((s) => s.updateSectionContent)
  const setImageUploading = useEditorStore((s) => s.setImageUploading)
  const inputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const { src, alt } = section.content
  const { size, shape, align } = section.style
  const displaySrc = previewUrl ?? src

  const handleSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0]
    e.target.value = ''
    if (!picked) {
      return
    }
    if (!picked.type.startsWith('image/')) {
      return toast.error('이미지 파일만 올릴 수 있어요')
    }
    if (picked.size > MAX_BYTES) {
      return toast.error('5MB 이하 이미지만 올릴 수 있어요')
    }

    const oldSrc = src
    setPreviewUrl(URL.createObjectURL(picked))
    setIsUploading(true)
    setImageUploading(true)

    const formData = new FormData()
    formData.append('file', picked)
    const result = await uploadImage(formData)
    if (!result.ok) {
      setIsUploading(false)
      setImageUploading(false)
      setPreviewUrl(null)
      return toast.error(result.message)
    }

    updateSectionContent(section.id, { src: result.url })
    if (oldSrc) {
      void deleteImage(oldSrc)
    }
    setIsUploading(false)
    setImageUploading(false)
    setPreviewUrl(null)
  }

  const openPicker = () => inputRef.current?.click()

  const handleRemoveImage = () => {
    if (src) {
      void deleteImage(src)
    }
    updateSectionContent(section.id, { src: '' })
  }

  // 첨부 미리보기 ObjectURL 메모리 해제
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  return (
    <div className={cn('flex', JUSTIFY_CLASS[align])}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleSelect}
        className="hidden"
      />
      {displaySrc ? (
        <div className={cn('flex w-full flex-col gap-2', SIZE_CLASS[size])}>
          <div className={cn('relative overflow-hidden', SHAPE_WRAP[shape])}>
            <img src={displaySrc} alt={alt} className={cn('w-full', SHAPE_IMG[shape])} />
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <Loader2 className="size-6 animate-spin text-white" />
              </div>
            )}
          </div>
          {isSelected && !isUploading && (
            <div className="flex gap-1.5 self-start">
              <button onClick={openPicker} className={cn(SEG_BASE, SEG_OFF)}>
                이미지 변경
              </button>
              <button
                onClick={handleRemoveImage}
                className={cn(SEG_BASE, 'text-destructive hover:bg-destructive/10')}
              >
                이미지 제거
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={openPicker}
          disabled={isUploading}
          className="border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground flex w-full cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed px-6 py-12 transition-colors"
        >
          <ImagePlus className="size-6" />
          <span className="text-sm">이미지 추가</span>
          <span className="text-muted-foreground/70 text-xs">클릭해서 선택 (5MB 이하)</span>
        </button>
      )}
    </div>
  )
}

export default SectionImage
