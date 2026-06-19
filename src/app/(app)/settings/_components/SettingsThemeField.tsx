'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { cn } from '@/lib/utils'

// 활성 상태는 .dark 클래스 기반 변형으로 표시
const BASE =
  'flex cursor-pointer items-center justify-center gap-2 rounded-lg border py-3 text-sm font-medium transition-colors'

const SettingsThemeField = () => {
  const { setTheme } = useTheme()

  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={() => setTheme('light')}
        className={cn(
          BASE,
          'border-foreground bg-muted/50 dark:text-muted-foreground dark:border-border dark:bg-transparent dark:font-normal',
        )}
      >
        <Sun className="size-4" />
        라이트
      </button>
      <button
        type="button"
        onClick={() => setTheme('dark')}
        className={cn(
          BASE,
          'text-muted-foreground dark:text-foreground dark:border-foreground dark:bg-muted/50 dark:font-medium',
        )}
      >
        <Moon className="size-4" />
        다크
      </button>
    </div>
  )
}

export default SettingsThemeField
