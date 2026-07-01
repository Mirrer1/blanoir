'use client'

import { ImagePlus, Loader2, Upload, X } from 'lucide-react'
import { useRef } from 'react'

import EditorTooltip from '../shell/EditorTooltip'
import EditorStyleField from './EditorStyleField'
import useImageUpload, { type UploadedImage } from '@/hooks/useImageUpload'

interface EditorImageFieldProps {
  label: string
  url: string
  alt?: string
  sectionId: string
  onChange: (uploaded: UploadedImage) => void
  onRemove: () => void
}

// 단일 이미지 업로드 필드
const EditorImageField = ({
  label,
  url,
  alt = '',
  sectionId,
  onChange,
  onRemove,
}: EditorImageFieldProps) => {
  const { isUploading, uploadOne } = useImageUpload(sectionId)
  const inputRef = useRef<HTMLInputElement>(null)

  const openPicker = () => inputRef.current?.click()

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0]
    e.target.value = ''
    if (!picked) {
      return
    }
    const uploaded = await uploadOne(picked)
    if (uploaded) {
      onChange(uploaded)
    }
  }

  return (
    <EditorStyleField label={label}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
      {url ? (
        <>
          <div className="bg-muted relative overflow-hidden rounded-lg border">
            <img src={url} alt={alt} className="aspect-video w-full object-cover" />
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <Loader2 className="size-5 animate-spin text-white" />
              </div>
            )}
          </div>
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
                onClick={onRemove}
                className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive flex size-7 cursor-pointer items-center justify-center rounded-md"
              >
                <X className="size-4" />
              </button>
            </EditorTooltip>
          </div>
        </>
      ) : (
        <button
          onClick={openPicker}
          disabled={isUploading}
          className="border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground flex aspect-video w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed text-xs transition-colors"
        >
          <ImagePlus className="size-4" />
          이미지 추가
        </button>
      )}
    </EditorStyleField>
  )
}

export default EditorImageField
