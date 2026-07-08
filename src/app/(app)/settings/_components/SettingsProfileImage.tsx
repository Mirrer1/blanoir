'use client'

import { Camera, Loader2, Trash2, UserRound } from 'lucide-react'
import { useRef, useState } from 'react'
import { toast } from 'sonner'

import { deleteImage, uploadImage } from '@/actions/upload'
import { updateProfileImage } from '@/actions/user'
import { Button } from '@/components/ui/button'

interface SettingsProfileImageProps {
  initialImage: string
}

const SettingsProfileImage = ({ initialImage }: SettingsProfileImageProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [image, setImage] = useState(initialImage)
  const [isUploading, setIsUploading] = useState(false)

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) {
      return
    }

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    const uploaded = await uploadImage(formData)
    if (!uploaded.ok) {
      toast.error(uploaded.message)
      setIsUploading(false)
      return
    }

    const saved = await updateProfileImage(uploaded.url)
    if (!saved.ok) {
      // 저장 실패 시 orphan 이미지 정리
      void deleteImage(uploaded.url)
      toast.error(saved.message)
      setIsUploading(false)
      return
    }

    setImage(uploaded.url)
    setIsUploading(false)
    toast.success('프로필 사진을 변경했어요')
  }

  const handleRemove = async () => {
    setIsUploading(true)
    const saved = await updateProfileImage('')
    if (!saved.ok) {
      toast.error(saved.message)
      setIsUploading(false)
      return
    }

    setImage('')
    setIsUploading(false)
    toast.success('프로필 사진을 제거했어요')
  }

  return (
    <div className="flex shrink-0 flex-col items-center gap-4">
      <div className="bg-muted text-muted-foreground relative flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-full">
        {image ? (
          <img src={image} alt="" className="size-full object-cover" />
        ) : (
          <UserRound className="size-12" />
        )}
        {isUploading ? (
          <div className="bg-background/60 absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-5 animate-spin" />
          </div>
        ) : null}
      </div>
      <div className="flex flex-col items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="w-32 leading-none"
        >
          <Camera />
          <span className="translate-y-px">{image ? '사진 변경' : '사진 추가'}</span>
        </Button>
        {image ? (
          <button
            type="button"
            onClick={handleRemove}
            disabled={isUploading}
            className="border-destructive/50 text-destructive hover:bg-destructive/10 inline-flex h-7 w-32 cursor-pointer items-center justify-center gap-1 rounded-md border px-2.5 text-[0.8rem] leading-none font-medium transition-colors disabled:pointer-events-none disabled:opacity-50"
          >
            <Trash2 className="size-3.5" />
            <span className="translate-y-px">제거</span>
          </button>
        ) : null}
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      <p className="text-muted-foreground text-xs">5MB 이하 이미지</p>
    </div>
  )
}

export default SettingsProfileImage
