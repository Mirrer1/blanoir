import FadeIn from '@/components/common/FadeIn'

const USE_CASES = [
  { title: '자기소개 · 포트폴리오', description: '나를 보여주는 한 페이지' },
  { title: '카페 · 매장 소개', description: '메뉴와 위치를 깔끔하게' },
  { title: '청첩장', description: '소중한 날을 우리만의 페이지로' },
  { title: '이력서', description: '링크 하나로 전하는 경력' },
  { title: '취미 · 개인 페이지', description: '좋아하는 것을 마음껏' },
  { title: '이벤트 안내', description: '모임과 행사 소식을 한눈에' },
]

const LandingUseCases = () => {
  return (
    <section className="bg-muted/30 border-y">
      <div className="mx-auto max-w-5xl px-6 py-24 sm:py-32">
        <FadeIn>
          <h2 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
            무엇이든 만들 수 있어요
          </h2>
        </FadeIn>
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {USE_CASES.map(({ title, description }, index) => (
            <FadeIn key={title} delay={index * 0.08}>
              <div className="bg-background hover:border-foreground/30 flex flex-col gap-2 rounded-lg border p-8 transition-colors">
                <h3 className="font-heading text-lg font-bold">{title}</h3>
                <p className="text-muted-foreground">{description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

export default LandingUseCases
