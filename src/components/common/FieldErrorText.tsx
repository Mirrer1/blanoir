'use client'

import { useState } from 'react'

import { cn } from '@/lib/utils'

// 에러 메시지를 작은 고정 높이 슬롯에서 페이드로 표시. 메시지가 사라져도 마지막 값을 유지해 부드럽게 사라지게 함.
const FieldErrorText = ({ message }: { message?: string }) => {
  const [shown, setShown] = useState(message)
  const [prev, setPrev] = useState(message)

  if (message !== prev) {
    setPrev(message)
    if (message) {
      setShown(message)
    }
  }

  return (
    <p
      role="alert"
      className={cn(
        'text-destructive -mt-1 min-h-4 text-xs leading-4 transition-opacity',
        message ? 'opacity-100' : 'opacity-0',
      )}
    >
      {shown}
    </p>
  )
}

export default FieldErrorText
