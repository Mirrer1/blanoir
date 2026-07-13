import { LayoutTemplate, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'

import { deleteImage } from '@/actions/upload'
import type { EditorTemplate } from '@/app/(editor)/edit/[pageId]/templates'
import useEditorStore from '@/store/editor'
import { sectionImageUrls } from '@/utils/imageUrls'

// 템플릿 적용 공용 훅
const useApplyTemplate = (onApplied: () => void) => {
  const sections = useEditorStore((s) => s.sections)
  const replaceSections = useEditorStore((s) => s.replaceSections)

  const applyTemplate = (template: EditorTemplate) => {
    const before = sections
    let undone = false
    let cleaned = false

    // 템플릿 적용되면 밀려난 이미지 정리
    const cleanup = () => {
      if (undone || cleaned) {
        return
      }
      cleaned = true
      before.flatMap(sectionImageUrls).forEach((url) => void deleteImage(url))
    }
    replaceSections(template.build())
    onApplied()
    toast(`${template.label} 템플릿을 적용했어요`, {
      icon: <LayoutTemplate className="size-4" />,
      duration: 4000,
      action: {
        label: (
          <span className="flex items-center gap-1.5">
            <RotateCcw className="size-3.5" />
            실행취소
          </span>
        ),
        onClick: () => {
          undone = true
          replaceSections(before)
        },
      },
      onAutoClose: cleanup,
      onDismiss: cleanup,
    })
  }

  return applyTemplate
}

export default useApplyTemplate
