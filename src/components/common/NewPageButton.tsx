'use client'

import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

import { createPage } from '@/actions/page'
import { Button } from '@/components/ui/button'

const NewPageButton = () => {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  const handleClick = async () => {
    setPending(true)
    const result = await createPage()
    if (!result.ok) {
      toast.error(result.message)
      setPending(false)
      return
    }

    router.push(`/edit/${result.pageId}`)
  }

  return (
    <Button onClick={handleClick} disabled={pending}>
      <Plus className="size-4" />새 페이지
    </Button>
  )
}

export default NewPageButton
