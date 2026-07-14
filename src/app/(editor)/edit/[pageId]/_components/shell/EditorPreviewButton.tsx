'use client'

import { useState } from 'react'

import PagePreview from '@/components/sections/PagePreview'
import { Button } from '@/components/ui/button'
import useEditorStore from '@/store/editor'

const EditorPreviewButton = () => {
  const title = useEditorStore((s) => s.title)
  const sections = useEditorStore((s) => s.sections)
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button data-tour="preview" size="sm" variant="outline" onClick={() => setOpen(true)}>
        미리보기
      </Button>
      <PagePreview open={open} onOpenChange={setOpen} sections={sections} title={title} />
    </>
  )
}

export default EditorPreviewButton
