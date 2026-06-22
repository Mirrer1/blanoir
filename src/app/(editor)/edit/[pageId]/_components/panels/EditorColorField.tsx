'use client'

import { Popover } from '@base-ui/react/popover'
import { Palette } from 'lucide-react'
import { useState } from 'react'

import EditorStyleField from './EditorStyleField'
import { cn } from '@/lib/utils'
import { isGradient } from '@/utils/colorFill'

// 모노톤 브랜드에 맞춘 저채도 뮤트 단색
const COLOR_PALETTE = ['', '#787774', '#C4554D', '#CC772F', '#548164', '#487CA5']
// 같은 뮤트 톤으로 큐레이션한 프리셋 그레디언트
const GRADIENTS = [
  'linear-gradient(135deg, #c4554d, #cc772f)',
  'linear-gradient(135deg, #487ca5, #8a67ab)',
  'linear-gradient(135deg, #548164, #487ca5)',
  'linear-gradient(135deg, #8a67ab, #c4554d)',
  'linear-gradient(135deg, #787774, #c4554d)',
  'linear-gradient(135deg, #cc772f, #c29b43)',
]
const GRADIENT_SAMPLE =
  'conic-gradient(from 0deg, #C4554D, #CC772F, #548164, #487CA5, #8A67AB, #C4554D)'
// 방향
const DIRECTIONS = [
  { label: '↗', angle: 45 },
  { label: '→', angle: 90 },
  { label: '↘', angle: 135 },
  { label: '↓', angle: 180 },
]
interface Draft {
  start: string
  end: string
  angle: number
}

const DEFAULT_DRAFT: Draft = { start: '#c4554d', end: '#487ca5', angle: 135 }

const buildGradient = ({ start, end, angle }: Draft) =>
  `linear-gradient(${angle}deg, ${start}, ${end})`

const parseGradient = (value: string): Draft | null => {
  const match = value.match(
    /^linear-gradient\(\s*(\d+)deg\s*,\s*(#[0-9a-fA-F]{3,8})\s*,\s*(#[0-9a-fA-F]{3,8})\s*\)$/,
  )
  return match
    ? { angle: Number(match[1]), start: match[2].toLowerCase(), end: match[3].toLowerCase() }
    : null
}

const SWATCH = 'size-6 cursor-pointer overflow-hidden rounded-full border'
const SWATCH_HOVER = 'transition-transform hover:scale-110'
const RING = 'ring-foreground ring-offset-background ring-2 ring-offset-2'

interface EditorColorFieldProps {
  label: string
  color: string
  onChange: (color: string) => void
  defaultColor?: string
}

const EditorColorField = ({
  label,
  color,
  onChange,
  defaultColor = 'var(--foreground)',
}: EditorColorFieldProps) => {
  const [open, setOpen] = useState(false)
  const isGrad = isGradient(color)
  const isCustomSolid = color !== '' && !isGrad && !COLOR_PALETTE.includes(color)
  const builder = parseGradient(color) ?? DEFAULT_DRAFT

  const setField = (field: keyof Draft, value: string | number) =>
    onChange(buildGradient({ ...builder, [field]: value }))

  return (
    <EditorStyleField label={label}>
      <div className="flex flex-wrap gap-2">
        {COLOR_PALETTE.map((value) => (
          <button
            key={value || 'default'}
            aria-label={value || '기본'}
            onClick={() => onChange(value)}
            className={cn(SWATCH, SWATCH_HOVER, color === value && RING)}
          >
            <span
              style={{ backgroundColor: value || defaultColor }}
              className="canvas-light block size-full"
            />
          </button>
        ))}

        <Popover.Root open={open} onOpenChange={setOpen}>
          <Popover.Trigger
            aria-label="그레디언트"
            style={{ backgroundImage: isGrad ? color : GRADIENT_SAMPLE }}
            className={cn(SWATCH, isGrad && RING)}
          />
          <Popover.Portal>
            <Popover.Positioner sideOffset={6} className="z-50">
              <Popover.Popup className="bg-background w-60 rounded-lg border p-3 shadow-md transition-[transform,opacity] duration-150 ease-out data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0">
                <p className="text-muted-foreground mb-2 text-xs">프리셋</p>
                <div className="grid grid-cols-6 gap-2">
                  {GRADIENTS.map((value) => (
                    <button
                      key={value}
                      aria-label="그레디언트 프리셋"
                      onClick={() => onChange(value)}
                      style={{ backgroundImage: value }}
                      className={cn(
                        'aspect-square cursor-pointer rounded-md border transition-transform hover:scale-105',
                        color === value && RING,
                      )}
                    />
                  ))}
                </div>

                <div className="border-border my-3 border-t" />

                <p className="text-muted-foreground mb-2 text-xs">직접 만들기</p>
                <div
                  style={{ backgroundImage: buildGradient(builder) }}
                  className="border-border mb-2 h-8 w-full rounded-md border"
                />
                <div className="flex items-center gap-2">
                  <label
                    aria-label="시작 색"
                    style={{ backgroundColor: builder.start }}
                    className="border-border relative size-7 cursor-pointer overflow-hidden rounded-md border"
                  >
                    <input
                      type="color"
                      value={builder.start}
                      onChange={(e) => setField('start', e.target.value)}
                      className="absolute inset-0 cursor-pointer opacity-0"
                    />
                  </label>
                  <label
                    aria-label="끝 색"
                    style={{ backgroundColor: builder.end }}
                    className="border-border relative size-7 cursor-pointer overflow-hidden rounded-md border"
                  >
                    <input
                      type="color"
                      value={builder.end}
                      onChange={(e) => setField('end', e.target.value)}
                      className="absolute inset-0 cursor-pointer opacity-0"
                    />
                  </label>
                  <div className="ml-auto flex gap-1">
                    {DIRECTIONS.map((d) => (
                      <button
                        key={d.angle}
                        aria-label={`방향 ${d.angle}도`}
                        onClick={() => setField('angle', d.angle)}
                        className={cn(
                          'flex size-7 cursor-pointer items-center justify-center rounded-md border text-xs transition-colors',
                          builder.angle === d.angle
                            ? 'bg-foreground text-background border-foreground'
                            : 'hover:bg-muted',
                        )}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>

        <label
          aria-label="사용자 지정 색"
          style={isCustomSolid ? { backgroundColor: color } : undefined}
          className={cn(
            SWATCH,
            SWATCH_HOVER,
            'text-muted-foreground relative flex items-center justify-center',
            !isCustomSolid && 'bg-muted',
            isCustomSolid && RING,
          )}
        >
          {!isCustomSolid && <Palette className="size-4" />}
          <input
            type="color"
            value={isCustomSolid ? color : '#000000'}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
        </label>
      </div>
    </EditorStyleField>
  )
}

export default EditorColorField
