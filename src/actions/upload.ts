'use server'

import { auth } from '@/lib/auth'
import cloudinary from '@/lib/cloudinary'

const MAX_BYTES = 5 * 1024 * 1024

type UploadResult = { ok: true; url: string } | { ok: false; message: string }

export async function uploadImage(formData: FormData): Promise<UploadResult> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { ok: false, message: '로그인이 필요해요' }
    }

    const file = formData.get('file')
    if (!(file instanceof File)) {
      return { ok: false, message: '파일이 없어요' }
    }
    if (!file.type.startsWith('image/')) {
      return { ok: false, message: '이미지 파일만 올릴 수 있어요' }
    }
    if (file.size > MAX_BYTES) {
      return { ok: false, message: '5MB 이하 이미지만 올릴 수 있어요' }
    }

    const bytes = Buffer.from(await file.arrayBuffer())
    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: `blanoir/${session.user.id}`, resource_type: 'image' },
          (error, uploaded) => (error || !uploaded ? reject(error) : resolve(uploaded)),
        )
        .end(bytes)
    })

    return { ok: true, url: result.secure_url }
  } catch (error) {
    console.error('uploadImage failed', error)
    return { ok: false, message: '잠시 후 다시 시도해 주세요' }
  }
}

// Cloudinary URL에서 public_id 추출
const publicIdFromUrl = (url: string): string | null => {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-z0-9]+$/i)
  return match ? match[1] : null
}

// 사용하지 않는 이미지 제거
export async function deleteImage(url: string): Promise<void> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return
    }
    const publicId = publicIdFromUrl(url)
    // 이미지 소유자 유효성 검사
    if (!publicId || !publicId.startsWith(`blanoir/${session.user.id}/`)) {
      return
    }
    await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    console.error('deleteImage failed', error)
  }
}

// URL 사본 병렬 생성
export async function copyImages(urls: string[]): Promise<{ from: string; to: string }[]> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return []
    }
    const userId = session.user.id
    const results = await Promise.all(
      urls.map(async (url) => {
        const publicId = publicIdFromUrl(url)
        // 본인 폴더 이미지만 복사 허용
        if (!publicId || !publicId.startsWith(`blanoir/${userId}/`)) {
          return null
        }
        try {
          const result = await cloudinary.uploader.upload(url, {
            folder: `blanoir/${userId}`,
            resource_type: 'image',
          })
          return { from: url, to: result.secure_url }
        } catch (error) {
          console.error('copyImages item failed', error)
          return null
        }
      }),
    )
    return results.filter((result) => result !== null)
  } catch (error) {
    console.error('copyImages failed', error)
    return []
  }
}
