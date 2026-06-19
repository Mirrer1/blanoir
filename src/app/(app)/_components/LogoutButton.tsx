'use client'

import { LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'

import { Button } from '@/components/ui/button'

const LogoutButton = () => {
  return (
    <div className="flex h-12 items-center">
      <Button
        variant="outline"
        className="border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive dark:border-destructive/50 dark:hover:bg-destructive/10 w-full dark:bg-transparent"
        onClick={() => signOut({ callbackUrl: '/' })}
      >
        <LogOut />
        로그아웃
      </Button>
    </div>
  )
}

export default LogoutButton
