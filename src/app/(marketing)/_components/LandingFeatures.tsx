import { Languages, MousePointerClick, Rocket } from 'lucide-react'

import FadeIn from '@/components/common/FadeIn'

const FEATURES = [
  {
    icon: MousePointerClick,
    title: '클릭만으로',
    description: '드래그하고 입력하면 끝. 배울 것도, 설치할 것도 없어요.',
  },
  {
    icon: Languages,
    title: '완전 한글',
    description: '한글에 최적화된 폰트와 인터페이스로 자연스럽게 만들어요.',
  },
  {
    icon: Rocket,
    title: '바로 공개',
    description: '완성하면 링크 하나로 누구에게나 바로 공유할 수 있어요.',
  },
]

const LandingFeatures = () => {
  return (
    <section className="bg-muted/30 border-y">
      <div className="mx-auto max-w-5xl px-6 py-24 sm:py-32">
        <div className="grid gap-12 sm:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, description }, index) => (
            <FadeIn key={title} delay={index * 0.1}>
              <div className="flex flex-col items-start gap-4">
                <div className="bg-background flex size-12 items-center justify-center rounded-lg border">
                  <Icon className="size-6" />
                </div>
                <h2 className="font-heading text-xl font-bold">{title}</h2>
                <p className="text-muted-foreground leading-7">{description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

export default LandingFeatures
