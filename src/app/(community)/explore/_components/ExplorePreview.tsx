'use client'

import { Maximize2 } from 'lucide-react'
import { useState } from 'react'

import ExploreTemplateButton from './ExploreTemplateButton'
import PagePreview from '@/components/sections/PagePreview'
import { Button } from '@/components/ui/button'
import type { Section } from '@/types/section'

const ExplorePreview = ({
  pageId,
  title,
  sections,
  allowRemix,
  isOwner,
  isLoggedIn,
}: {
  pageId: string
  title: string
  sections: Section[]
  allowRemix: boolean
  isOwner: boolean
  isLoggedIn: boolean
}) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)} aria-label="미리보기">
        <Maximize2 className="size-4" />
        <span className="hidden sm:inline">미리보기</span>
      </Button>
      <PagePreview
        open={open}
        onOpenChange={setOpen}
        sections={sections}
        title={title}
        actions={
          allowRemix && !isOwner ? (
            <ExploreTemplateButton pageId={pageId} isLoggedIn={isLoggedIn} />
          ) : undefined
        }
      />
    </>
  )
}

export default ExplorePreview
