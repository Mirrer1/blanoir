'use client'

import { Pencil } from 'lucide-react'
import { type KeyboardEvent, useRef, useState } from 'react'

import { Input } from '@/components/ui/input'
import useEditorStore from '@/store/editor'

const PLACEHOLDER = '제목 없는 페이지'

const EditorTitle = () => {
  const title = useEditorStore((s) => s.title)
  const setTitle = useEditorStore((s) => s.setTitle)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const cancelRef = useRef(false)

  const startEdit = () => {
    setDraft(title)
    setEditing(true)
  }

  const commit = () => {
    if (cancelRef.current) {
      cancelRef.current = false
      setEditing(false)
      return
    }
    setTitle(draft.trim())
    setEditing(false)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      commit()
    } else if (e.key === 'Escape') {
      cancelRef.current = true
      setEditing(false)
    }
  }

  return (
    <>
      {editing ? (
        <Input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onFocus={(e) => e.target.select()}
          onBlur={commit}
          onKeyDown={handleKeyDown}
          placeholder={PLACEHOLDER}
          className="h-8 w-48 text-sm sm:w-64"
        />
      ) : (
        <button
          onClick={startEdit}
          className="group/title flex min-w-0 cursor-pointer items-center gap-1.5"
        >
          <span className="truncate text-sm font-medium">{title || PLACEHOLDER}</span>
          <Pencil className="text-muted-foreground size-3.5 shrink-0 opacity-0 transition-opacity group-hover/title:opacity-100" />
        </button>
      )}
    </>
  )
}

export default EditorTitle
