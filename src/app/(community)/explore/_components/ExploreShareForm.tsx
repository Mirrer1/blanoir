'use client'

import { AlertDialog } from '@base-ui/react/alert-dialog'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import { CATEGORIES, type ExploreCategory } from '../_data/categories'
import ExplorePostComposer from './ExplorePostComposer'
import ExploreSharePageSelect from './ExploreSharePageSelect'
import ExploreShareRepImage from './ExploreShareRepImage'
import { shareToCommunity, unshareFromCommunity } from '@/actions/explore'
import { deleteImage } from '@/actions/upload'
import { Button } from '@/components/ui/button'
import type { UploadedImage } from '@/hooks/useImageUpload'
import { cn } from '@/lib/utils'

// 입력 여부 판단
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
  sharedToCommunity: boolean
  thumbnail: string
  textPreview: string
}

export interface ShareEdit {
  page: SharePageItem
  from: 'editor' | 'detail'
  alreadyShared: boolean
  category: ExploreCategory | ''
  allowRemix: boolean
  communityImage: string
  communityPost: string
}

const ExploreShareForm = ({ pages, edit }: { pages: SharePageItem[]; edit?: ShareEdit }) => {
  const router = useRouter()
  const [pageId, setPageId] = useState(edit?.page.pageId ?? '')
  const [category, setCategory] = useState<ExploreCategory | ''>(edit?.category ?? '')
  const [allowRemix, setAllowRemix] = useState(edit?.allowRemix ?? true)
  const [repOverride, setRepOverride] = useState<UploadedImage | null>(null)
  const [post, setPost] = useState(edit?.communityPost ?? '')
  const [busy, setBusy] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [guardOpen, setGuardOpen] = useState(false)

  const uploadedPostImages = useRef<Set<string>>(new Set())
  const bumpBusy = (uploading: boolean) => setBusy((count) => count + (uploading ? 1 : -1))
  const defaultImage = edit
    ? edit.communityImage
    : (pages.find((page) => page.pageId === pageId)?.thumbnail ?? '')
  const canShare = pageId !== '' && busy === 0 && !submitting
  let returnPath = '/explore'
  if (edit) {
    returnPath =
      edit.from === 'detail' ? `/explore/${edit.page.pageId}` : `/edit/${edit.page.pageId}`
  }
  const unshareReturnPath = edit?.from === 'detail' ? '/explore' : returnPath
  const isDirty = edit
    ? repOverride !== null ||
      post !== edit.communityPost ||
      category !== edit.category ||
      allowRemix !== edit.allowRemix
    : pageId !== '' ||
      category !== '' ||
      !allowRemix ||
      repOverride !== null ||
      hasPostContent(post)
  const isDirtyRef = useRef(isDirty)

  // 페이지 바꾸면 덮어쓴 이미지 정리
  const handlePageChange = (id: string) => {
    if (repOverride) {
      void deleteImage(repOverride.url)
      setRepOverride(null)
    }
    setPageId(id)
  }

  // 세션 중 업로드 이미지 정리
  const cleanupUploads = () => {
    if (repOverride) {
      void deleteImage(repOverride.url)
    }
    uploadedPostImages.current.forEach((url) => void deleteImage(url))
    uploadedPostImages.current.clear()
  }

  // 업로드 이미지 정리 후 이동
  const handleLeave = () => {
    cleanupUploads()
    router.push(returnPath)
  }

  // 작성 컨텐츠 여부 확인
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
      toast.success(edit?.alreadyShared ? '템플릿 정보를 수정했어요' : '템플릿으로 추가했어요')
      router.push(returnPath)
    } else {
      toast.error(result.message)
      setSubmitting(false)
    }
  }

  // 해제 후 올린 이미지 정리
  const handleUnshare = async () => {
    setSubmitting(true)
    const result = await unshareFromCommunity(pageId)
    if (result.ok) {
      cleanupUploads()
      toast.success('템플릿을 삭제했어요')
      router.push(unshareReturnPath)
    } else {
      toast.error(result.message)
      setSubmitting(false)
    }
  }

  // 이탈 가드용 최신 dirty 동기화
  useEffect(() => {
    isDirtyRef.current = isDirty
  }, [isDirty])

  // 새로고침이나 닫기 경고
  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isDirtyRef.current) {
        event.preventDefault()
        event.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [])

  // 뒤로가기 작성 컨텐츠 여부 확인 모달
  useEffect(() => {
    window.history.pushState(null, '', window.location.href)
    const onPopState = () => {
      if (isDirtyRef.current) {
        window.history.pushState(null, '', window.location.href)
        setGuardOpen(true)
      } else {
        router.back()
      }
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [router])

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-4 rounded-lg border p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="font-medium">템플릿으로 만들 페이지</span>
          {edit ? (
            <span className="max-w-full truncate text-sm font-medium">
              {edit.page.title || '제목 없는 페이지'}
            </span>
          ) : (
            <ExploreSharePageSelect pages={pages} selected={pageId} onSelect={handlePageChange} />
          )}
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
            initialHtml={edit?.communityPost}
            onChange={setPost}
            onUploadingChange={bumpBusy}
            onImageUploaded={(url) => uploadedPostImages.current.add(url)}
          />
        </div>
      </section>

      <div className="flex justify-end gap-2">
        {edit?.alreadyShared && (
          <Button
            variant="outline"
            onClick={handleUnshare}
            disabled={submitting}
            className="text-destructive border-destructive/40 hover:bg-destructive/10 hover:text-destructive dark:border-destructive/50 dark:hover:bg-destructive/20 mr-auto"
          >
            템플릿 삭제
          </Button>
        )}
        <Button variant="outline" onClick={handleCancel}>
          취소
        </Button>
        <Button onClick={handleShare} disabled={!canShare}>
          {edit?.alreadyShared ? '수정' : '템플릿 추가'}
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
