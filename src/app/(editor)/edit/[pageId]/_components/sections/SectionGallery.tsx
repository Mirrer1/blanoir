'use client'

import { ImagePlus } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import SectionGalleryView from '@/components/sections/SectionGalleryView'
import useImageUpload from '@/hooks/useImageUpload'
import useEditorStore from '@/store/editor'
import type { GallerySection } from '@/types/section'

const SectionGallery = ({ section }: { section: GallerySection }) => {
  const updateSectionContent = useEditorStore((s) => s.updateSectionContent)
  const { isUploading, uploadMany } = useImageUpload()
  const inputRef = useRef<HTMLInputElement>(null)
  const [previews, setPreviews] = useState<string[]>([])
  const { images } = section.content

  // 첫 업로드는 캔버스에서 처리하고 이후 관리는 패널에서
  const handleSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? [])
    e.target.value = ''
    if (!picked.length) {
      return
    }
    setPreviews(picked.map((file) => URL.createObjectURL(file)))
    const uploaded = await uploadMany(picked)
    if (uploaded.length) {
      updateSectionContent(section.id, { images: [...images, ...uploaded] })
    }
    setPreviews([])
  }

  const openPicker = () => inputRef.current?.click()

  // 첨부 미리보기 ObjectURL 메모리 해제
  useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url))
  }, [previews])

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleSelect}
        className="hidden"
      />
      {images.length || previews.length ? (
        <SectionGalleryView section={section} pendingUrls={previews} />
      ) : (
        <button
          onClick={openPicker}
          disabled={isUploading}
          className="group/add border-foreground/25 hover:border-foreground/40 w-full cursor-pointer rounded-xl border border-dashed p-5 transition-colors"
        >
          <div className="grid grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="bg-muted-foreground/20 aspect-square w-full rounded-lg" />
            ))}
          </div>
          <div className="text-muted-foreground group-hover/add:text-foreground mt-4 flex items-center justify-center gap-1.5 text-sm transition-colors">
            <ImagePlus className="size-4" />
            <span>클릭해서 이미지 추가</span>
          </div>
          <p className="text-muted-foreground/70 mt-1 text-center text-xs">
            여러 장 선택 가능 (각 5MB 이하)
          </p>
        </button>
      )}
    </div>
  )
}

export default SectionGallery
