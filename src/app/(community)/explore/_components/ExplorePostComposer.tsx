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
  type LucideIcon,
  Quote,
  Strikethrough,
  Underline,
} from 'lucide-react'
import { nanoid } from 'nanoid'
import { useCallback, useRef } from 'react'

import { uploadImageFile } from '@/hooks/useImageUpload'

interface ExplorePostComposerProps {
  onChange?: (html: string) => void
  onUploadingChange: (uploading: boolean) => void
  onImageUploaded?: (url: string) => void // 이탈 시 정리용 URL 추적
  initialHtml?: string // 편집 모드 소개글 프리필
}

// execCommand 툴바 항목 그룹
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

// lucide Loader 스피너
const LOADER_SVG =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-6 animate-spin"><line x1="12" x2="12" y1="2" y2="6"/><line x1="12" x2="12" y1="18" y2="22"/><line x1="4.93" x2="7.76" y1="4.93" y2="7.76"/><line x1="16.24" x2="19.07" y1="16.24" y2="19.07"/><line x1="2" x2="6" y1="12" y2="12"/><line x1="18" x2="22" y1="12" y2="12"/><line x1="4.93" x2="7.76" y1="19.07" y2="16.24"/><line x1="16.24" x2="19.07" y1="7.76" y2="4.93"/></svg>'

// 복사 오버레이
const UPLOADING_OVERLAY =
  'bg-background/60 text-muted-foreground pointer-events-none absolute inset-0 z-20 flex items-center justify-center rounded-lg backdrop-blur-[1px]'

const ExplorePostComposer = ({
  onChange,
  onUploadingChange,
  onImageUploaded,
  initialHtml,
}: ExplorePostComposerProps) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const initialHtmlRef = useRef(initialHtml ?? '')

  const attachEditor = useCallback((node: HTMLDivElement | null) => {
    editorRef.current = node
    if (node) {
      node.innerHTML = initialHtmlRef.current
    }
  }, [])

  const sync = () => onChange?.(editorRef.current?.innerHTML ?? '')

  // 선택 유지 후 명령 실행
  const exec = (command: string, arg?: string) => {
    editorRef.current?.focus()
    document.execCommand(command, false, arg)
    sync()
  }

  // 커서 자리에 노드 삽입
  const insertAtCaret = (node: Node) => {
    const editor = editorRef.current
    if (!editor) {
      return
    }
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0 && editor.contains(selection.anchorNode)) {
      const range = selection.getRangeAt(0)
      range.collapse(false)
      range.insertNode(node)
      range.setStartAfter(node)
      range.collapse(true)
      selection.removeAllRanges()
      selection.addRange(range)
    } else {
      editor.appendChild(node)
    }
  }

  // 낙관적 삽입 후 백그라운드 업로드
  const uploadAndInsert = async (file: File) => {
    const id = nanoid(6)
    const localUrl = URL.createObjectURL(file)

    // 로딩 미리보기 즉시 삽입
    const wrapper = document.createElement('span')
    wrapper.contentEditable = 'false'
    wrapper.dataset.uploading = id
    wrapper.className = 'relative my-3 block'
    const preview = document.createElement('img')
    preview.src = localUrl
    preview.className = 'w-full rounded-lg border'
    preview.style.margin = '0'
    const overlay = document.createElement('span')
    overlay.className = UPLOADING_OVERLAY
    overlay.innerHTML = LOADER_SVG
    wrapper.append(preview, overlay)

    editorRef.current?.focus()
    insertAtCaret(wrapper)
    sync()

    onUploadingChange(true)
    const uploaded = await uploadImageFile(file)

    // 실패하면 영역 공백 처리
    if (!uploaded) {
      onUploadingChange(false)
      URL.revokeObjectURL(localUrl)
      editorRef.current?.querySelector(`[data-uploading="${id}"]`)?.remove()
      sync()
      return
    }

    // 교체 전 프리패치
    await new Promise<void>((resolve) => {
      const preloaded = new Image()
      preloaded.onload = () => resolve()
      preloaded.onerror = () => resolve()
      preloaded.src = uploaded.url
    })

    URL.revokeObjectURL(localUrl)
    onImageUploaded?.(uploaded.url)
    const placeholder = editorRef.current?.querySelector(`[data-uploading="${id}"]`)
    if (placeholder) {
      const img = document.createElement('img')
      img.src = uploaded.url
      img.alt = uploaded.alt
      img.className = 'my-3 w-full rounded-lg border'
      placeholder.replaceWith(img)
    }
    onUploadingChange(false)
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
          aria-label="이미지 추가"
          className={TOOL_BUTTON}
        >
          <ImagePlus className="size-4" />
        </button>
      </div>
      <div
        ref={attachEditor}
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
