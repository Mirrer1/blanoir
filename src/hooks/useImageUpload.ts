import { useState } from 'react'
import { toast } from 'sonner'

import { uploadImage } from '@/actions/upload'
import useEditorStore from '@/store/editor'
import altFromFileName from '@/utils/altFromFileName'

const MAX_BYTES = 5 * 1024 * 1024

export interface UploadedImage {
  url: string
  alt: string
}

const isValidImage = (file: File) => {
  if (!file.type.startsWith('image/')) {
    toast.error('이미지 파일만 올릴 수 있어요')
    return false
  }
  if (file.size > MAX_BYTES) {
    toast.error('5MB 이하 이미지만 올릴 수 있어요')
    return false
  }
  return true
}

const upload = async (file: File): Promise<UploadedImage | null> => {
  const formData = new FormData()
  formData.append('file', file)
  const result = await uploadImage(formData)
  if (!result.ok) {
    toast.error(result.message)
    return null
  }
  return { url: result.url, alt: altFromFileName(file.name) }
}

// sectionId로 섹션 잠금을 등록하는 이미지 업로드 공용 훅
const useImageUpload = (sectionId?: string) => {
  const setUploading = useEditorStore((s) => s.setUploading)
  const [isUploading, setIsUploading] = useState(false)

  const begin = () => {
    setIsUploading(true)
    if (sectionId) {
      setUploading(sectionId, true)
    }
  }

  const end = () => {
    setIsUploading(false)
    if (sectionId) {
      setUploading(sectionId, false)
    }
  }

  const uploadOne = async (file: File): Promise<UploadedImage | null> => {
    if (!isValidImage(file)) {
      return null
    }
    begin()
    try {
      return await upload(file)
    } finally {
      end()
    }
  }

  const uploadMany = async (files: File[]): Promise<UploadedImage[]> => {
    const valid = files.filter(isValidImage)
    if (!valid.length) {
      return []
    }
    begin()
    try {
      const uploaded: UploadedImage[] = []
      for (const file of valid) {
        const one = await upload(file)
        if (one) {
          uploaded.push(one)
        }
      }
      return uploaded
    } finally {
      end()
    }
  }

  return { isUploading, uploadOne, uploadMany }
}

export default useImageUpload
