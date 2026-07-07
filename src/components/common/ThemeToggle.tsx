'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import IconTooltip from '@/components/common/IconTooltip'
import { Button } from '@/components/ui/button'

// 테마 토글 버튼
const ThemeToggle = ({ tooltip }: { tooltip?: string }) => {
  const { resolvedTheme, setTheme } = useTheme()

  // 현재 테마 반대로 전환
  const toggleTheme = () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')

  const button = (
    <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="테마 전환">
      <Sun className="size-5 scale-100 dark:scale-0" />
      <Moon className="absolute size-5 scale-0 dark:scale-100" />
    </Button>
  )

  if (!tooltip) {
    return button
  }
  return <IconTooltip label={tooltip}>{button}</IconTooltip>
}

export default ThemeToggle
