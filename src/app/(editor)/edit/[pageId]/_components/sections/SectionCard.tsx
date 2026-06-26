'use client'

import { ImagePlus } from 'lucide-react'
import { nanoid } from 'nanoid'
import { useEffect, useRef, useState } from 'react'

import SectionCardView from '@/components/sections/SectionCardView'
import useImageUpload from '@/hooks/useImageUpload'
import useEditorStore from '@/store/editor'
import type { CardSection } from '@/types/section'

const CARD_PLACEHOLDERS = { title: '제목을 입력하세요', description: '설명을 입력하세요' }

const SectionCard = ({ section }: { section: CardSection }) => {
  const updateSectionContent = useEditorStore((s) => s.updateSectionContent)
  const { isUploading, uploadMany } = useImageUpload()
  const inputRef = useRef<HTMLInputElement>(null)
  const [previews, setPreviews] = useState<string[]>([])
  const { cards } = section.content

  // 첫 업로드 캔버스에서 처리, 이후 추가/편집은 패널에서
  const handleSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? [])
    e.target.value = ''
    if (!picked.length) {
      return
    }
    setPreviews(picked.map((file) => URL.createObjectURL(file)))
    const uploaded = await uploadMany(picked)
    if (uploaded.length) {
      const created = uploaded.map((image) => ({
        id: nanoid(8),
        image: image.url,
        alt: image.alt,
        title: '',
        description: '',
      }))
      updateSectionContent(section.id, { cards: [...cards, ...created] })
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
      {cards.length || previews.length ? (
        <SectionCardView
          section={section}
          pendingUrls={previews}
          placeholders={CARD_PLACEHOLDERS}
        />
      ) : (
        <button
          onClick={openPicker}
          disabled={isUploading}
          className="group/add border-foreground/25 hover:border-foreground/40 w-full cursor-pointer rounded-xl border border-dashed p-5 transition-colors"
        >
          <div className="grid grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="border-border bg-muted/30 flex flex-col gap-2 rounded-lg border p-2"
              >
                <div className="bg-muted-foreground/20 aspect-video w-full rounded" />
                <div className="bg-muted-foreground/20 h-2.5 w-2/3 rounded" />
                <div className="bg-muted-foreground/20 h-2 w-full rounded" />
              </div>
            ))}
          </div>
          <div className="text-muted-foreground group-hover/add:text-foreground mt-4 flex items-center justify-center gap-1.5 text-sm transition-colors">
            <ImagePlus className="size-4" />
            <span>클릭해서 카드 만들기</span>
          </div>
          <p className="text-muted-foreground/70 mt-1 text-center text-xs">
            사진을 여러 장 선택하면 사진마다 카드가 생겨요 (각 5MB 이하)
          </p>
        </button>
      )}
    </div>
  )
}

export default SectionCard
