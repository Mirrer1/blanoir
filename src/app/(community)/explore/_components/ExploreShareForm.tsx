'use client'

import { AlertDialog } from '@base-ui/react/alert-dialog'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { toast } from 'sonner'

import { CATEGORIES, type ExploreCategory } from '../_data/categories'
import ExplorePostComposer from './ExplorePostComposer'
import ExploreSharePageSelect from './ExploreSharePageSelect'
import ExploreShareRepImage from './ExploreShareRepImage'
import { shareToCommunity } from '@/actions/explore'
import { deleteImage } from '@/actions/upload'
import { Button } from '@/components/ui/button'
import type { UploadedImage } from '@/hooks/useImageUpload'
import { cn } from '@/lib/utils'

// 태그를 뺀 텍스트나 이미지 유무로 소개 입력 여부 판단
const hasPostContent = (html: string) =>
  /<img/i.test(html) ||
  html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim().length > 0

export interface SharePageItem {
  pageId: string
  title: string
  isPublic: boolean
  thumbnail: string
  textPreview: string
}

const ExploreShareForm = ({ pages }: { pages: SharePageItem[] }) => {
  const router = useRouter()
  const [pageId, setPageId] = useState('')
  const [category, setCategory] = useState<ExploreCategory | ''>('')
  const [allowRemix, setAllowRemix] = useState(true)
  const [repOverride, setRepOverride] = useState<UploadedImage | null>(null)
  const [post, setPost] = useState('')
  const [busy, setBusy] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [guardOpen, setGuardOpen] = useState(false)

  const uploadedPostImages = useRef<Set<string>>(new Set())
  const bumpBusy = (uploading: boolean) => setBusy((count) => count + (uploading ? 1 : -1))
  const defaultImage = pages.find((page) => page.pageId === pageId)?.thumbnail ?? ''
  const canShare = pageId !== '' && busy === 0 && !submitting
  const isDirty =
    pageId !== '' || category !== '' || !allowRemix || repOverride !== null || hasPostContent(post)

  // 페이지를 바꾸면 덮어쓴 이미지 정리
  const handlePageChange = (id: string) => {
    if (repOverride) {
      void deleteImage(repOverride.url)
      setRepOverride(null)
    }
    setPageId(id)
  }

  // 저장 없이 나가므로 올린 이미지를 정리하고 이동
  const handleLeave = () => {
    if (repOverride) {
      void deleteImage(repOverride.url)
    }
    uploadedPostImages.current.forEach((url) => void deleteImage(url))
    uploadedPostImages.current.clear()
    router.push('/explore')
  }

  // 작성물이 있으면 확인 모달을 거치고 없으면 바로 나감
  const handleCancel = () => {
    if (isDirty) {
      setGuardOpen(true)
    } else {
      handleLeave()
    }
  }

  // 공유 성공 시 저장된 이미지는 정리 없이 목록으로 이동
  const handleShare = async () => {
    setSubmitting(true)
    const result = await shareToCommunity({
      pageId,
      category,
      allowRemix,
      communityImage: repOverride?.url ?? defaultImage,
      communityPost: post,
    })
    if (result.ok) {
      toast.success('둘러보기에 공유했어요')
      router.push('/explore')
    } else {
      toast.error(result.message)
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-4 rounded-lg border p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="font-medium">공유할 페이지</span>
          <ExploreSharePageSelect pages={pages} selected={pageId} onSelect={handlePageChange} />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="font-medium">카테고리</span>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setCategory((prev) => (prev === item.key ? '' : item.key))}
                className={cn(
                  'cursor-pointer rounded-full border border-transparent px-3 py-1 text-sm font-medium transition-colors',
                  category === item.key
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground border-border',
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="font-medium">템플릿으로 허용</span>
            <p className="text-muted-foreground text-sm">
              다른 사람이 이 페이지를 템플릿으로 가져갈 수 있어요
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={allowRemix}
            aria-label="템플릿으로 허용"
            onClick={() => setAllowRemix((prev) => !prev)}
            className={cn(
              'relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors',
              allowRemix ? 'bg-foreground' : 'bg-muted',
            )}
          >
            <span
              className={cn(
                'bg-background absolute top-0.5 left-0.5 size-5 rounded-full shadow-sm transition-transform',
                allowRemix && 'translate-x-5',
              )}
            />
          </button>
        </div>
      </section>

      <section className="flex flex-col gap-5 rounded-lg border p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-lg font-semibold tracking-tight">대표 이미지</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            목록과 상세 위에 보여요. 기본은 페이지 첫 이미지예요
          </p>
        </div>
        <ExploreShareRepImage
          defaultImage={defaultImage}
          override={repOverride}
          onChange={setRepOverride}
          onUploadingChange={bumpBusy}
        />
      </section>

      <section className="rounded-lg border p-6">
        <h2 className="font-heading text-lg font-semibold tracking-tight">소개</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          글과 사진으로 이 페이지를 자유롭게 소개해보세요
        </p>
        <div className="mt-8">
          <ExplorePostComposer
            onChange={setPost}
            onUploadingChange={bumpBusy}
            onImageUploaded={(url) => uploadedPostImages.current.add(url)}
          />
        </div>
      </section>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleCancel}>
          취소
        </Button>
        <Button onClick={handleShare} disabled={!canShare}>
          공유하기
        </Button>
      </div>

      <AlertDialog.Root open={guardOpen} onOpenChange={setGuardOpen}>
        <AlertDialog.Portal>
          <AlertDialog.Backdrop className="fixed inset-0 z-50 bg-black/40 transition-opacity duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
          <AlertDialog.Popup className="bg-background fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl border p-6 shadow-lg transition-all duration-150 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0">
            <AlertDialog.Title className="text-base font-semibold">
              저장되지 않은 내용이 있어요
            </AlertDialog.Title>
            <AlertDialog.Description className="text-muted-foreground mt-2 text-sm">
              지금 나가면 작성한 내용이 사라져요.
            </AlertDialog.Description>
            <div className="mt-6 flex justify-end gap-2">
              <AlertDialog.Close render={<Button variant="outline" size="sm" />}>
                계속 작성
              </AlertDialog.Close>
              <Button size="sm" onClick={handleLeave}>
                나가기
              </Button>
            </div>
          </AlertDialog.Popup>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </div>
  )
}

export default ExploreShareForm
