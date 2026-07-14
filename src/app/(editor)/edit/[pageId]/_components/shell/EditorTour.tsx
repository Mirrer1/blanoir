'use client'

import { X } from 'lucide-react'
import { useLayoutEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import { EDITOR_TOUR_STEPS } from './editorTourSteps'
import { Button } from '@/components/ui/button'

const CARD_W = 320
const CARD_H = 168
const GAP = 16

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

// rect 기준 카드 여백 방향 결정
const placeCard = (rect: DOMRect | null, vw: number, vh: number) => {
  if (!rect) {
    return { left: (vw - CARD_W) / 2, top: (vh - CARD_H) / 2 }
  }
  if (rect.bottom + GAP + CARD_H <= vh) {
    return { top: rect.bottom + GAP, left: clamp(rect.left, GAP, vw - CARD_W - GAP) }
  }
  if (rect.top - GAP - CARD_H >= 0) {
    return { top: rect.top - GAP - CARD_H, left: clamp(rect.left, GAP, vw - CARD_W - GAP) }
  }
  if (rect.right + GAP + CARD_W <= vw) {
    return { left: rect.right + GAP, top: clamp(rect.top, GAP, vh - CARD_H - GAP) }
  }
  if (rect.left - GAP - CARD_W >= 0) {
    return { left: rect.left - GAP - CARD_W, top: clamp(rect.top, GAP, vh - CARD_H - GAP) }
  }
  return { left: (vw - CARD_W) / 2, top: (vh - CARD_H) / 2 }
}

const EditorTour = ({ onClose }: { onClose: () => void }) => {
  const [stepIndex, setStepIndex] = useState(0)
  const [rect, setRect] = useState<DOMRect | null>(null)
  const [pos, setPos] = useState({ left: 0, top: 0 })

  const step = EDITOR_TOUR_STEPS[stepIndex]
  const isLast = stepIndex === EDITOR_TOUR_STEPS.length - 1

  // 스텝의 대상 요소를 찾아 위치를 재측정
  useLayoutEffect(() => {
    const target = EDITOR_TOUR_STEPS[stepIndex].target
    // 대상이 화면 밖이면 스크롤 포커스
    if (target) {
      document.querySelector(`[data-tour="${target}"]`)?.scrollIntoView({ block: 'center' })
    }
    const measure = () => {
      const el = target ? document.querySelector(`[data-tour="${target}"]`) : null
      const next = el ? el.getBoundingClientRect() : null
      setRect(next)
      setPos(placeCard(next, window.innerWidth, window.innerHeight))
    }
    measure()
    window.addEventListener('resize', measure)
    window.addEventListener('scroll', measure, true)
    return () => {
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', measure, true)
    }
  }, [stepIndex])

  useLayoutEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        return onClose()
      }
      if (event.key === 'ArrowRight') {
        setStepIndex((i) => Math.min(i + 1, EDITOR_TOUR_STEPS.length - 1))
      }
      if (event.key === 'ArrowLeft') {
        setStepIndex((i) => Math.max(i - 1, 0))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const next = () => (isLast ? onClose() : setStepIndex((i) => i + 1))
  const prev = () => setStepIndex((i) => Math.max(i - 1, 0))

  return createPortal(
    <div className="animate-in fade-in-0 fixed inset-0 z-[70] duration-150">
      {rect ? (
        <div
          className="pointer-events-none absolute rounded-lg transition-all duration-300 ease-out"
          style={{
            top: rect.top - 4,
            left: rect.left - 4,
            width: rect.width + 8,
            height: rect.height + 8,
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.6)',
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-black/60" />
      )}
      <div className="pointer-events-none absolute inset-0">
        {rect && (
          <div
            className="absolute rounded-lg border-2 border-white/50 transition-all duration-300 ease-out"
            style={{
              top: rect.top - 4,
              left: rect.left - 4,
              width: rect.width + 8,
              height: rect.height + 8,
            }}
          />
        )}
        <div
          role="dialog"
          aria-modal="true"
          className="bg-background pointer-events-auto absolute w-80 rounded-xl border p-5 shadow-lg transition-all duration-300 ease-out"
          style={{ left: pos.left, top: pos.top }}
        >
          <button
            onClick={onClose}
            aria-label="닫기"
            className="text-muted-foreground hover:text-foreground absolute top-3 right-3 cursor-pointer transition-colors"
          >
            <X className="size-4" />
          </button>
          <p className="pr-6 text-base font-semibold break-keep">{step.title}</p>
          <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed break-keep whitespace-pre-line">
            {step.body}
          </p>
          <div className="mt-5 flex items-center justify-between">
            <div className="flex gap-1.5">
              {EDITOR_TOUR_STEPS.map((s, i) => (
                <span
                  key={s.title}
                  className={`size-1.5 rounded-full transition-colors ${
                    i === stepIndex ? 'bg-foreground' : 'bg-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              {stepIndex > 0 && (
                <Button variant="ghost" size="sm" onClick={prev}>
                  이전
                </Button>
              )}
              <Button size="sm" onClick={next}>
                {isLast ? '완료' : '다음'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default EditorTour
