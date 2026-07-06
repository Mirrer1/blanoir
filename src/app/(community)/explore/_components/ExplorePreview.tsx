'use client'

import { Eye } from 'lucide-react'
import { useState } from 'react'

import ExploreTemplateButton from './ExploreTemplateButton'
import PagePreview from '@/components/sections/PagePreview'
import { Button } from '@/components/ui/button'
import type { Section } from '@/types/section'

const ExplorePreview = ({
  sections,
  allowRemix,
  isLoggedIn,
}: {
  sections: Section[]
  allowRemix: boolean
  isLoggedIn: boolean
}) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Eye className="size-4" />
        미리보기
      </Button>
      <PagePreview
        open={open}
        onOpenChange={setOpen}
        sections={sections}
        actions={allowRemix ? <ExploreTemplateButton isLoggedIn={isLoggedIn} /> : undefined}
      />
    </>
  )
}

export default ExplorePreview
