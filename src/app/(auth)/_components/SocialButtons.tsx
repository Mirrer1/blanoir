'use client'

import { signIn } from 'next-auth/react'

import { Button } from '@/components/ui/button'

const GoogleIcon = () => (
  <svg viewBox="0 0 48 48" className="size-5">
    <path
      fill="#FFC107"
      d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
    />
    <path
      fill="#FF3D00"
      d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
    />
    <path
      fill="#1976D2"
      d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
    />
  </svg>
)

const KakaoIcon = () => (
  <svg viewBox="0 0 24 24" className="size-5" fill="currentColor">
    <path d="M12 3C6.48 3 2 6.58 2 11c0 2.79 1.86 5.23 4.65 6.63-.2.73-.73 2.64-.83 3.05-.13.51.19.5.4.36.16-.11 2.6-1.77 3.66-2.49.69.1 1.4.15 2.12.15 5.52 0 10-3.58 10-8S17.52 3 12 3z" />
  </svg>
)

const NaverIcon = () => (
  <svg viewBox="0 0 24 24" className="size-4" fill="currentColor">
    <path d="M16.273 12.845 7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z" />
  </svg>
)

const PROVIDERS = [
  {
    id: 'google',
    label: '구글로 계속하기',
    icon: <GoogleIcon />,
    className:
      'border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50 hover:text-zinc-900 dark:border-transparent dark:bg-white/85 dark:text-zinc-900 dark:hover:bg-white/75 dark:hover:text-zinc-900',
  },
  {
    id: 'kakao',
    label: '카카오로 계속하기',
    icon: <KakaoIcon />,
    className:
      'bg-[#FEE500] text-[#191600] hover:bg-[#FEE500]/90 hover:text-[#191600] dark:bg-[#FEE500]/85 dark:hover:bg-[#FEE500]/75 dark:hover:text-[#191600]',
  },
  {
    id: 'naver',
    label: '네이버로 계속하기',
    icon: <NaverIcon />,
    className:
      'bg-[#03C75A] text-white hover:bg-[#03C75A]/90 hover:text-white dark:bg-[#03C75A]/85 dark:hover:bg-[#03C75A]/75 dark:hover:text-white',
  },
]

const SocialButtons = () => {
  return (
    <div className="flex flex-col gap-2">
      {PROVIDERS.map(({ id, label, icon, className }) => (
        <Button
          key={id}
          variant="ghost"
          className={`h-11 w-full justify-center gap-2 text-sm font-medium ${className}`}
          onClick={() => signIn(id, { callbackUrl: '/dashboard' })}
        >
          {icon}
          {label}
        </Button>
      ))}
    </div>
  )
}

export default SocialButtons
