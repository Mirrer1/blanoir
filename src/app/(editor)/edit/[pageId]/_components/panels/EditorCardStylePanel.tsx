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
import { nanoid } from 'nanoid'
import { useRef } from 'react'

import { SEG_BASE, SEG_OFF, SEG_ON } from '../../controlStyles'
import EditorAlignField from './EditorAlignField'
import EditorCardItem from './EditorCardItem'
import EditorStyleField from './EditorStyleField'
import { deleteImage } from '@/actions/upload'
import useImageUpload from '@/hooks/useImageUpload'
import { cn } from '@/lib/utils'
import useEditorStore from '@/store/editor'
import type { CardItem, CardLayout, CardSection } from '@/types/section'

const LAYOUT_OPTIONS: { value: CardLayout; label: string }[] = [
  { value: 'vertical', label: '세로형' },
  { value: 'horizontal', label: '가로형' },
  { value: 'grid', label: '그리드형' },
]

const EditorCardStylePanel = ({ section }: { section: CardSection }) => {
  const updateSectionContent = useEditorStore((s) => s.updateSectionContent)
  const updateSectionStyle = useEditorStore((s) => s.updateSectionStyle)
  const { uploadOne, uploadMany } = useImageUpload()
  const addInputRef = useRef<HTMLInputElement>(null)
  const pickInputRef = useRef<HTMLInputElement>(null)
  const pickTargetRef = useRef<string | null>(null)
  const { cards } = section.content
  const { layout, align } = section.style

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }))

  const setCards = (next: CardItem[]) => updateSectionContent(section.id, { cards: next })

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) {
      return
    }
    const from = cards.findIndex((card) => card.id === active.id)
    const to = cards.findIndex((card) => card.id === over.id)
    if (from !== -1 && to !== -1) {
      setCards(arrayMove(cards, from, to))
    }
  }

  const openAdd = () => addInputRef.current?.click()

  // 고른 사진마다 카드 한 개씩 생성
  const handleAdd = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? [])
    e.target.value = ''
    if (!picked.length) {
      return
    }
    const uploaded = await uploadMany(picked)
    if (uploaded.length) {
      const created = uploaded.map((image) => ({
        id: nanoid(8),
        image: image.url,
        alt: image.alt,
        title: '',
        description: '',
      }))
      setCards([...cards, ...created])
    }
  }

  // 숨김 파일 입력은 대상을 불명확해 카드 id를 먼저 저장
  const openPick = (id: string) => {
    pickTargetRef.current = id
    pickInputRef.current?.click()
  }

  const handlePick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0]
    e.target.value = ''
    const targetId = pickTargetRef.current
    pickTargetRef.current = null
    if (!picked || !targetId) {
      return
    }
    const uploaded = await uploadOne(picked)
    if (!uploaded) {
      return
    }
    const target = cards.find((card) => card.id === targetId)
    setCards(
      cards.map((card) =>
        card.id === targetId ? { ...card, image: uploaded.url, alt: uploaded.alt } : card,
      ),
    )
    // 교체된 옛 이미지는 Cloudinary에서 삭제
    if (target?.image) {
      void deleteImage(target.image)
    }
  }

  // 이미지만 비우고 카드는 유지
  // 옛 이미지는 Cloudinary에서 삭제
  const handleRemoveImage = (id: string) => {
    const target = cards.find((card) => card.id === id)
    if (target?.image) {
      void deleteImage(target.image)
    }
    setCards(cards.map((card) => (card.id === id ? { ...card, image: '', alt: '' } : card)))
  }

  // 카드 삭제 시 이미지 Cloudinary에서 정리
  const handleRemoveCard = (id: string) => {
    const target = cards.find((card) => card.id === id)
    if (target?.image) {
      void deleteImage(target.image)
    }
    setCards(cards.filter((card) => card.id !== id))
  }

  const handleTitleChange = (id: string, value: string) =>
    setCards(cards.map((card) => (card.id === id ? { ...card, title: value } : card)))

  const handleDescriptionChange = (id: string, value: string) =>
    setCards(cards.map((card) => (card.id === id ? { ...card, description: value } : card)))

  return (
    <>
      <EditorStyleField label="레이아웃">
        <div className="flex gap-1">
          {LAYOUT_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => updateSectionStyle(section.id, { layout: option.value })}
              className={cn(SEG_BASE, 'flex-1', layout === option.value ? SEG_ON : SEG_OFF)}
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

      <EditorStyleField label="카드">
        <input
          ref={addInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleAdd}
          className="hidden"
        />
        <input
          ref={pickInputRef}
          type="file"
          accept="image/*"
          onChange={handlePick}
          className="hidden"
        />
        {cards.length > 0 && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={cards.map((card) => card.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col gap-2">
                {cards.map((card) => (
                  <EditorCardItem
                    key={card.id}
                    card={card}
                    onPickImage={openPick}
                    onRemoveImage={handleRemoveImage}
                    onTitleChange={handleTitleChange}
                    onDescriptionChange={handleDescriptionChange}
                    onRemoveCard={handleRemoveCard}
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
          카드 추가
        </button>
      </EditorStyleField>
    </>
  )
}

export default EditorCardStylePanel
