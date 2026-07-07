'use client'

import { Share2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import useEditorStore from '@/store/editor'

const EditorShareButton = () => {
  const router = useRouter()
  const pageId = useEditorStore((s) => s.pageId)
  const sharedToCommunity = useEditorStore((s) => s.sharedToCommunity)

  // 공유된 템플릿에서만 관리 버튼 노출
  if (!sharedToCommunity) {
    return null
  }

  return (
    <Button size="sm" onClick={() => router.push(`/explore/share?pageId=${pageId}`)}>
      <Share2 />
      템플릿 관리
    </Button>
  )
}

export default EditorShareButton
