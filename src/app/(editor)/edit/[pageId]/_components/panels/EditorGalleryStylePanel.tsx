'use client'

import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { ImagePlus } from 'lucide-react'
import { useRef } from 'react'

import { SEG_BASE, SEG_OFF, SEG_ON } from '../../controlStyles'
import EditorGalleryItem from './EditorGalleryItem'
import EditorStyleField from './EditorStyleField'
import { deleteImage } from '@/actions/upload'
import useImageUpload from '@/hooks/useImageUpload'
import { cn } from '@/lib/utils'
import useEditorStore from '@/store/editor'
import type { GalleryGap, GallerySection, ImageShape } from '@/types/section'

const SHAPE_OPTIONS: { value: ImageShape; label: string }[] = [
  { value: 'square', label: '사각' },
  { value: 'rounded', label: '둥근' },
  { value: 'circle', label: '원형' },
]
const GAP_OPTIONS: { value: GalleryGap; label: string }[] = [
  { value: 'none', label: '없음' },
  { value: 'small', label: '좁게' },
  { value: 'medium', label: '보통' },
  { value: 'large', label: '넓게' },
]

const EditorGalleryStylePanel = ({ section }: { section: GallerySection }) => {
  const updateSectionContent = useEditorStore((s) => s.updateSectionContent)
  const updateSectionStyle = useEditorStore((s) => s.updateSectionStyle)
  const { uploadOne, uploadMany } = useImageUpload(section.id)
  const addInputRef = useRef<HTMLInputElement>(null)
  const replaceInputRef = useRef<HTMLInputElement>(null)
  const replaceTargetRef = useRef<string | null>(null)
  const { images } = section.content
  const { shape, gap } = section.style

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }))

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) {
      return
    }
    const from = images.findIndex((image) => image.url === active.id)
    const to = images.findIndex((image) => image.url === over.id)
    if (from !== -1 && to !== -1) {
      updateSectionContent(section.id, { images: arrayMove(images, from, to) })
    }
  }

  // 제거 시 Cloudinary 이미지도 함께 정리
  const handleRemove = (url: string) => {
    void deleteImage(url)
    updateSectionContent(section.id, { images: images.filter((image) => image.url !== url) })
  }

  const openAdd = () => addInputRef.current?.click()

  const handleAdd = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? [])
    e.target.value = ''
    if (!picked.length) {
      return
    }
    const uploaded = await uploadMany(picked)
    if (uploaded.length) {
      updateSectionContent(section.id, { images: [...images, ...uploaded] })
    }
  }

  // 숨김 파일 입력은 대상이 불명확해 이미지 url을 먼저 저장
  const openReplace = (url: string) => {
    replaceTargetRef.current = url
    replaceInputRef.current?.click()
  }

  const handleReplace = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0]
    e.target.value = ''
    const target = replaceTargetRef.current
    replaceTargetRef.current = null
    if (!picked || !target) {
      return
    }
    const uploaded = await uploadOne(picked)
    if (!uploaded) {
      return
    }
    const index = images.findIndex((image) => image.url === target)
    if (index === -1) {
      return
    }
    const next = [...images]
    // 슬롯의 링크는 교체해도 유지
    next[index] = { ...uploaded, link: images[index].link }
    updateSectionContent(section.id, { images: next })
    // 교체된 옛 이미지는 Cloudinary에서 삭제
    void deleteImage(target)
  }

  const handleLinkChange = (url: string, value: string) =>
    updateSectionContent(section.id, {
      images: images.map((image) => (image.url === url ? { ...image, link: value } : image)),
    })

  return (
    <>
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

      <EditorStyleField label="간격">
        <div className="flex gap-1">
          {GAP_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => updateSectionStyle(section.id, { gap: option.value })}
              className={cn(SEG_BASE, 'flex-1', gap === option.value ? SEG_ON : SEG_OFF)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </EditorStyleField>

      <EditorStyleField label="이미지">
        <input
          ref={addInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleAdd}
          className="hidden"
        />
        <input
          ref={replaceInputRef}
          type="file"
          accept="image/*"
          onChange={handleReplace}
          className="hidden"
        />
        {images.length > 0 && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={images.map((image) => image.url)}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col gap-1.5">
                {images.map((image) => (
                  <EditorGalleryItem
                    key={image.url}
                    url={image.url}
                    link={image.link ?? ''}
                    onReplace={openReplace}
                    onRemove={handleRemove}
                    onLinkChange={handleLinkChange}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
        <button
          onClick={openAdd}
          className="border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-md border border-dashed py-2 text-xs transition-colors"
        >
          <ImagePlus className="size-4" />
          이미지 추가
        </button>
      </EditorStyleField>
    </>
  )
}

export default EditorGalleryStylePanel
