'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'

// 테마 토글 버튼
const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme()

  // 현재 테마 반대로 전환
  const toggleTheme = () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="테마 전환">
      <Sun className="size-5 scale-100 dark:scale-0" />
      <Moon className="absolute size-5 scale-0 dark:scale-100" />
    </Button>
  )
}

export default ThemeToggle
