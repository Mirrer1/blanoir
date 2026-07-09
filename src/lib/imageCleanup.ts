import cloudinary from '@/lib/cloudinary'
import { connectDB } from '@/lib/mongoDB'
import Page from '@/models/Page'
import User from '@/models/User'
import type { Section } from '@/types/section'
import { publicIdFromUrl } from '@/utils/cloudinaryPublicId'
import { findOrphanPublicIds } from '@/utils/imageCleanup'
import type { CloudinaryResourceInfo } from '@/utils/imageCleanup'
import { communityImageUrls, sectionImageUrls } from '@/utils/imageUrls'

const GRACE_PERIOD_MS = 24 * 60 * 60 * 1000
const CLOUDINARY_PREFIX = 'blanoir/'
const LIST_PAGE_SIZE = 500
const DELETE_BATCH_SIZE = 100

type PageForCleanup = { sections: Section[]; communityImage?: string; communityPost?: string }

type CleanupSummary = {
  dryRun: boolean
  scannedResources: number
  inUseCount: number
  orphanPublicIds: string[]
  deletedCount: number
}

type ResourcesListResponse = {
  resources: { public_id: string; created_at: string }[]
  next_cursor?: string
}

// 저장된 이미지 URL public_id 집합으로 변환
const collectInUsePublicIds = async (): Promise<Set<string>> => {
  const [pages, users] = await Promise.all([
    Page.find().select('sections communityImage communityPost').lean<PageForCleanup[]>(),
    User.find().select('profileImage').lean<{ profileImage?: string }[]>(),
  ])

  const urls = [
    ...pages.flatMap((page) => [
      ...page.sections.flatMap(sectionImageUrls),
      ...communityImageUrls(page),
    ]),
    ...users.map((user) => user.profileImage).filter((url): url is string => Boolean(url)),
  ]

  return new Set(urls.map(publicIdFromUrl).filter((id): id is string => id !== null))
}

// blanoir/ 리소스 전체를 커서 페이지네이션으로 조회
const listAllResources = async (): Promise<CloudinaryResourceInfo[]> => {
  const resources: CloudinaryResourceInfo[] = []
  let nextCursor: string | undefined

  do {
    const result: ResourcesListResponse = await cloudinary.api.resources({
      type: 'upload',
      prefix: CLOUDINARY_PREFIX,
      max_results: LIST_PAGE_SIZE,
      next_cursor: nextCursor,
    })
    resources.push(
      ...result.resources.map((resource) => ({
        publicId: resource.public_id,
        createdAt: resource.created_at,
      })),
    )
    nextCursor = result.next_cursor
  } while (nextCursor)

  return resources
}

// 삭제 API는 요청당 public_id 최대 100개 제한
const deleteInBatches = async (publicIds: string[]): Promise<number> => {
  for (let i = 0; i < publicIds.length; i += DELETE_BATCH_SIZE) {
    await cloudinary.api.delete_resources(publicIds.slice(i, i + DELETE_BATCH_SIZE))
  }
  return publicIds.length
}

// 안 쓰는 이미지를 스캔해 정리하고 dryRun이면 로그만 남김
export async function cleanupOrphanImages(dryRun: boolean): Promise<CleanupSummary> {
  await connectDB()

  const [inUsePublicIds, resources] = await Promise.all([
    collectInUsePublicIds(),
    listAllResources(),
  ])
  const orphanPublicIds = findOrphanPublicIds(
    resources,
    inUsePublicIds,
    new Date(),
    GRACE_PERIOD_MS,
  )
  const deletedCount =
    dryRun || orphanPublicIds.length === 0 ? 0 : await deleteInBatches(orphanPublicIds)

  console.log(`[cleanupOrphanImages] ${dryRun ? 'dry-run' : '실삭제'}`, {
    scanned: resources.length,
    inUse: inUsePublicIds.size,
    orphans: orphanPublicIds,
    deleted: deletedCount,
  })

  return {
    dryRun,
    scannedResources: resources.length,
    inUseCount: inUsePublicIds.size,
    orphanPublicIds,
    deletedCount,
  }
}
