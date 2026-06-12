const STEPS = [
  {
    step: '01',
    title: '회원가입',
    description: '소셜 로그인으로 10초면 시작할 수 있어요.',
  },
  {
    step: '02',
    title: '섹션 추가',
    description: '제목, 이미지, 버튼을 클릭으로 쌓아 페이지를 채워요.',
  },
  {
    step: '03',
    title: '공개하기',
    description: '토글 하나로 전 세계에 페이지를 공개해요.',
  },
]

const LandingHowItWorks = () => {
  return (
    <section className="bg-muted/30 border-y">
      <div className="mx-auto max-w-5xl px-6 py-32">
        <h2 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
          이렇게 만들어요
        </h2>
        <div className="mt-16 grid gap-12 sm:grid-cols-3">
          {STEPS.map(({ step, title, description }) => (
            <div key={step} className="flex flex-col gap-3">
              <span className="font-heading text-muted-foreground/30 text-5xl font-extrabold">
                {step}
              </span>
              <h3 className="font-heading text-xl font-bold">{title}</h3>
              <p className="text-muted-foreground leading-7">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default LandingHowItWorks
