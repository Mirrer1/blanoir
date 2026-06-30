import { Mail } from 'lucide-react'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import LogoutButton from '../_components/LogoutButton'
import SettingsPasswordForm from './_components/SettingsPasswordForm'
import SettingsPlans from './_components/SettingsPlans'
import SettingsProfileForm from './_components/SettingsProfileForm'
import SettingsProfileImage from './_components/SettingsProfileImage'
import SettingsSection from './_components/SettingsSection'
import SettingsThemeField from './_components/SettingsThemeField'
import SocialIcon from '@/components/common/SocialIcon'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/mongoDB'
import User, { type Provider } from '@/models/User'

const PROVIDER_LABEL: Record<Provider, string> = {
  google: '구글',
  kakao: '카카오',
  naver: '네이버',
  local: '이메일',
}

export const metadata: Metadata = { title: '설정' }

interface LoadedUser {
  name: string
  handle: string
  email: string
  profileImage: string
  provider: Provider
  createdAt: Date
}

const SettingsPage = async () => {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }

  await connectDB()
  const user = await User.findById(session.user.id)
    .select('name handle email profileImage provider createdAt')
    .lean<LoadedUser | null>()
  if (!user) {
    redirect('/login')
  }

  const isLocal = user.provider === 'local'
  const providerLabel = PROVIDER_LABEL[user.provider] ?? user.provider
  const joinedAt = new Date(user.createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="font-heading text-2xl font-extrabold tracking-tight">설정</h1>
      <div className="mt-8 flex flex-col gap-6">
        <SettingsSection title="프로필" description="다른 사람에게 보이는 이름과 페이지 주소예요">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:gap-10">
            <SettingsProfileImage initialImage={user.profileImage} />
            <SettingsProfileForm defaultName={user.name} defaultHandle={user.handle} />
          </div>
        </SettingsSection>

        <div className="grid gap-6 sm:grid-cols-2">
          <SettingsSection title="계정" description="로그인에 사용하는 이메일과 가입 정보예요">
            <dl className="divide-border/70 flex flex-col divide-y text-sm">
              <div className="flex items-center justify-between gap-4 pb-3">
                <dt className="text-muted-foreground">이메일</dt>
                <dd className="truncate">{user.email}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-3">
                <dt className="text-muted-foreground">로그인 방식</dt>
                <dd className="flex items-center gap-1.5">
                  {user.provider === 'local' ? (
                    <Mail className="text-muted-foreground size-4" />
                  ) : (
                    <SocialIcon provider={user.provider} className="size-4" />
                  )}
                  {providerLabel}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 pt-3">
                <dt className="text-muted-foreground">가입일</dt>
                <dd>{joinedAt}</dd>
              </div>
            </dl>
          </SettingsSection>

          <SettingsSection
            title="비밀번호"
            description={isLocal ? '6개월마다 바꾸면 계정을 더 안전하게 지킬 수 있어요' : undefined}
          >
            {isLocal ? (
              <SettingsPasswordForm />
            ) : (
              <p className="text-muted-foreground text-sm">
                {providerLabel} 계정으로 로그인하고 있어 비밀번호가 없어요.
              </p>
            )}
          </SettingsSection>
        </div>

        <SettingsSection title="요금제">
          <SettingsPlans />
        </SettingsSection>

        <div className="grid gap-6 sm:grid-cols-2">
          <SettingsSection title="화면" description="이 기기에서 보이는 테마예요">
            <SettingsThemeField />
          </SettingsSection>

          <SettingsSection title="로그아웃" description="이 기기에서 로그아웃합니다">
            <LogoutButton />
          </SettingsSection>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
