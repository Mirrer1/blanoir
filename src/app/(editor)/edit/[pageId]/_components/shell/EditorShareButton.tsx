'use client'

import { Share2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import useEditorStore from '@/store/editor'

const EditorShareButton = () => {
  const router = useRouter()
  const pageId = useEditorStore((s) => s.pageId)
  const sharedToCommunity = useEditorStore((s) => s.sharedToCommunity)
  const remixedFrom = useEditorStore((s) => s.remixedFrom)

  // 가져온 템플릿은 공유할 수 없어 버튼 숨김
  if (remixedFrom) {
    return null
  }

  return (
    <Button
      size="sm"
      variant={sharedToCommunity ? 'default' : 'outline'}
      onClick={() => router.push(`/explore/share?pageId=${pageId}`)}
    >
      <Share2 />
      템플릿 관리
    </Button>
  )
}

export default EditorShareButton
