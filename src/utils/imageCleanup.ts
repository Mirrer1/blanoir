export type CloudinaryResourceInfo = {
  publicId: string
  createdAt: string
}

// 참조 없고 유예 기간 지난 이미지만 고아로 판단
export const findOrphanPublicIds = (
  resources: CloudinaryResourceInfo[],
  inUsePublicIds: Set<string>,
  now: Date,
  gracePeriodMs: number,
): string[] =>
  resources
    .filter((resource) => !inUsePublicIds.has(resource.publicId))
    .filter((resource) => now.getTime() - new Date(resource.createdAt).getTime() > gracePeriodMs)
    .map((resource) => resource.publicId)
