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

// 이미지 업로드 공용 훅
const useImageUpload = () => {
  const setImageUploading = useEditorStore((s) => s.setImageUploading)
  const [isUploading, setIsUploading] = useState(false)

  const uploadOne = async (file: File): Promise<UploadedImage | null> => {
    if (!isValidImage(file)) {
      return null
    }
    setIsUploading(true)
    setImageUploading(true)
    const uploaded = await upload(file)
    setIsUploading(false)
    setImageUploading(false)
    return uploaded
  }

  const uploadMany = async (files: File[]): Promise<UploadedImage[]> => {
    const valid = files.filter(isValidImage)
    if (!valid.length) {
      return []
    }
    setIsUploading(true)
    setImageUploading(true)
    const uploaded: UploadedImage[] = []
    for (const file of valid) {
      const one = await upload(file)
      if (one) {
        uploaded.push(one)
      }
    }
    setIsUploading(false)
    setImageUploading(false)
    return uploaded
  }

  return { isUploading, uploadOne, uploadMany }
}

export default useImageUpload
