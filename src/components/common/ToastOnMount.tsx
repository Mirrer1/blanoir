'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'

interface ToastOnMountProps {
  message?: string
  type?: 'error' | 'success'
  id?: string
}

// 클라이언트 전용 토스트
const ToastOnMount = ({ message, type = 'error', id }: ToastOnMountProps) => {
  useEffect(() => {
    if (message) {
      toast[type](message, { id })
    }
  }, [message, type, id])

  return null
}

export default ToastOnMount
