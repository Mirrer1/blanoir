'use client'

import { ImageIcon, Loader2, Trash2, Upload } from 'lucide-react'
import { useRef, useState } from 'react'

import { deleteImage } from '@/actions/upload'
import { type UploadedImage, uploadImageFile } from '@/hooks/useImageUpload'
import { cn } from '@/lib/utils'
import { optimizedImageUrl } from '@/utils/cloudinaryOptimize'

interface ExploreShareRepImageProps {
  defaultImage: string // 선택한 페이지의 기본 대표이미지
  override: UploadedImage | null // 직접 올려 덮어쓴 이미지
  onChange: (image: UploadedImage | null) => void
  onUploadingChange: (uploading: boolean) => void
}

const ExploreShareRepImage = ({
  defaultImage,
  override,
  onChange,
  onUploadingChange,
}: ExploreShareRepImageProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const shown = override?.url || defaultImage

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) {
      return
    }
    setUploading(true)
    onUploadingChange(true)
    const uploaded = await uploadImageFile(file)
    setUploading(false)
    onUploadingChange(false)
    if (!uploaded) {
      return
    }
    if (override) {
      void deleteImage(override.url)
    }
    onChange(uploaded)
  }

  const revert = () => {
    if (override) {
      void deleteImage(override.url)
    }
    onChange(null)
  }

  return (
    <div className="flex flex-col gap-3 sm:w-64">
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={handleFile} />
      <div className="bg-muted/40 relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg border">
        {shown ? (
          <img src={optimizedImageUrl(shown)} alt="" className="h-full w-full object-cover" />
        ) : (
          <ImageIcon className="text-muted-foreground/40 size-8" strokeWidth={1.5} />
        )}
        {uploading && (
          <div className="bg-background/60 absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-5 animate-spin" />
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={cn(
            'text-muted-foreground hover:border-foreground/30 hover:text-foreground flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-60',
          )}
        >
          <Upload className="size-4" />
          {override ? '다시 올리기' : '직접 올리기'}
        </button>
        {override && (
          <button
            type="button"
            onClick={revert}
            aria-label="올린 이미지 제거"
            className="text-muted-foreground hover:border-foreground/30 hover:text-destructive flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border transition-colors"
          >
            <Trash2 className="size-4" />
          </button>
        )}
      </div>
    </div>
  )
}

export default ExploreShareRepImage
