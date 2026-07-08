'use client'

import { signIn } from 'next-auth/react'

import SocialIcon from '@/components/common/SocialIcon'
import { Button } from '@/components/ui/button'

const PROVIDERS = [
  {
    id: 'google',
    label: '구글로 계속하기',
    icon: <SocialIcon provider="google" />,
    className:
      'border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50 hover:text-zinc-900 dark:border-transparent dark:bg-white/85 dark:text-zinc-900 dark:hover:bg-white/75 dark:hover:text-zinc-900',
  },
  {
    id: 'kakao',
    label: '카카오로 계속하기',
    icon: <SocialIcon provider="kakao" />,
    className:
      'bg-[#FEE500] text-[#191600] hover:bg-[#FEE500]/90 hover:text-[#191600] dark:bg-[#FEE500]/85 dark:hover:bg-[#FEE500]/75 dark:hover:text-[#191600]',
  },
  {
    id: 'naver',
    label: '네이버로 계속하기',
    icon: <SocialIcon provider="naver" />,
    className:
      'bg-[#03C75A] text-white hover:bg-[#03C75A]/90 hover:text-white dark:bg-[#03C75A]/85 dark:hover:bg-[#03C75A]/75 dark:hover:text-white',
  },
]

const SocialButtons = ({ callbackUrl = '/dashboard' }: { callbackUrl?: string }) => {
  return (
    <div className="flex flex-col gap-2">
      {PROVIDERS.map(({ id, label, icon, className }) => (
        <Button
          key={id}
          variant="ghost"
          className={`h-9 w-full justify-center gap-2 text-sm font-medium ${className}`}
          onClick={() => signIn(id, { callbackUrl })}
        >
          <span className="flex w-5 shrink-0 justify-center">{icon}</span>
          <span className="w-28 text-left">{label}</span>
        </Button>
      ))}
    </div>
  )
}

export default SocialButtons
