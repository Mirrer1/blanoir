'use client'

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading,
  ImagePlus,
  Italic,
  List,
  ListOrdered,
  Loader2,
  type LucideIcon,
  Quote,
  Strikethrough,
  Underline,
} from 'lucide-react'
import { useRef, useState } from 'react'

import { uploadImageFile } from '@/hooks/useImageUpload'
import { cn } from '@/lib/utils'

interface ExplorePostComposerProps {
  onChange?: (html: string) => void
  onUploadingChange: (uploading: boolean) => void
  onImageUploaded?: (url: string) => void // 이탈 시 정리용으로 올린 URL 추적
}

// execCommand 기반 툴바 항목을 그룹별로 정의
const TOOL_GROUPS: { command: string; arg?: string; label: string; icon: LucideIcon }[][] = [
  [
    { command: 'bold', label: '굵게', icon: Bold },
    { command: 'italic', label: '기울임', icon: Italic },
    { command: 'underline', label: '밑줄', icon: Underline },
    { command: 'strikeThrough', label: '취소선', icon: Strikethrough },
  ],
  [
    { command: 'formatBlock', arg: 'h2', label: '제목', icon: Heading },
    { command: 'formatBlock', arg: 'blockquote', label: '인용', icon: Quote },
  ],
  [
    { command: 'insertUnorderedList', label: '글머리 기호', icon: List },
    { command: 'insertOrderedList', label: '번호 목록', icon: ListOrdered },
  ],
  [
    { command: 'justifyLeft', label: '왼쪽 정렬', icon: AlignLeft },
    { command: 'justifyCenter', label: '가운데 정렬', icon: AlignCenter },
    { command: 'justifyRight', label: '오른쪽 정렬', icon: AlignRight },
  ],
]

const TOOL_BUTTON =
  'flex size-8 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'

const ExplorePostComposer = ({
  onChange,
  onUploadingChange,
  onImageUploaded,
}: ExplorePostComposerProps) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const sync = () => onChange?.(editorRef.current?.innerHTML ?? '')

  // 편집 영역 선택을 유지하도록 mousedown을 막고 명령 실행
  const exec = (command: string, arg?: string) => {
    editorRef.current?.focus()
    document.execCommand(command, false, arg)
    sync()
  }

  // 버튼과 붙여넣기가 공유하는 업로드 후 삽입
  const uploadAndInsert = async (file: File) => {
    setUploading(true)
    onUploadingChange(true)
    const uploaded = await uploadImageFile(file)
    setUploading(false)
    onUploadingChange(false)
    if (!uploaded) {
      return
    }
    onImageUploaded?.(uploaded.url)
    editorRef.current?.focus()
    document.execCommand(
      'insertHTML',
      false,
      `<img src="${uploaded.url}" alt="${uploaded.alt}" class="my-3 w-full rounded-lg border" />`,
    )
    sync()
  }

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (file) {
      void uploadAndInsert(file)
    }
  }

  // 캡처나 이미지 붙여넣기도 업로드 경로에 포함
  const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    const file = Array.from(event.clipboardData.items)
      .find((item) => item.type.startsWith('image/'))
      ?.getAsFile()
    if (file) {
      event.preventDefault()
      void uploadAndInsert(file)
    }
  }

  return (
    <div className="focus-within:border-foreground/30 rounded-lg border transition-colors">
      <div className="flex flex-wrap items-center gap-0.5 border-b p-1.5">
        {TOOL_GROUPS.map((group, index) => (
          <div key={index} className="flex items-center gap-0.5">
            {index > 0 && <span className="bg-border mx-1 h-5 w-px" />}
            {group.map((tool) => (
              <button
                key={tool.label}
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => exec(tool.command, tool.arg)}
                aria-label={tool.label}
                className={TOOL_BUTTON}
              >
                <tool.icon className="size-4" />
              </button>
            ))}
          </div>
        ))}
        <span className="bg-border mx-1 h-5 w-px" />
        <input ref={inputRef} type="file" accept="image/*" hidden onChange={handleFile} />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          aria-label="이미지 추가"
          className={cn(TOOL_BUTTON, 'disabled:cursor-not-allowed disabled:opacity-60')}
        >
          {uploading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <ImagePlus className="size-4" />
          )}
        </button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={sync}
        onPaste={handlePaste}
        data-placeholder="글과 사진으로 이 페이지를 자유롭게 소개해보세요"
        className="[&:empty]:before:text-muted-foreground/40 [&_blockquote]:border-border [&_blockquote]:text-muted-foreground min-h-64 p-4 leading-relaxed break-words whitespace-pre-wrap outline-none [&_blockquote]:my-2 [&_blockquote]:border-l-2 [&_blockquote]:pl-3 [&_h2]:my-2 [&_h2]:text-xl [&_h2]:font-bold [&_img]:my-3 [&_img]:w-full [&_img]:rounded-lg [&_img]:border [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&:empty]:before:content-[attr(data-placeholder)]"
      />
    </div>
  )
}

export default ExplorePostComposer
