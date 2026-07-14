import Image from 'next/image'

import FadeIn from '@/components/common/FadeIn'

const LandingAbout = () => {
  return (
    <section className="mx-auto max-w-5xl px-6 py-24 sm:py-32">
      <FadeIn>
        <div className="flex items-start justify-between gap-8">
          <div className="flex items-start gap-3">
            <span className="font-heading text-5xl leading-none font-extrabold tracking-tight sm:text-6xl">
              01
            </span>
            <span className="text-muted-foreground pt-1.5 text-xs font-medium tracking-widest uppercase">
              About
            </span>
          </div>
          <p className="text-muted-foreground hidden max-w-52 text-right text-sm leading-6 text-balance break-keep sm:block">
            만들기의 문턱을 없앴어요. 당신의 이야기를 담을 한 페이지.
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <h2 className="font-heading mt-12 max-w-2xl text-3xl leading-tight font-extrabold tracking-tight text-balance break-keep sm:mt-16 sm:pl-[18%] sm:text-5xl">
          복잡함은 덜고, 만드는 즐거움만 남겼어요.
        </h2>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="text-muted-foreground mt-12 grid gap-8 leading-7 break-keep sm:grid-cols-2 sm:pl-[18%]">
          <p className="text-pretty">
            블라누아는 비개발자도 5분 안에 자기 홈페이지를 만들고 공개할 수 있는 한글 노코드 페이지
            빌더예요. 드래그하고 입력하면 그대로 내 페이지가 됩니다.
          </p>
          <p className="text-pretty">
            제목·이미지·갤러리·카드·버튼까지, 필요한 블록을 클릭으로 쌓기만 하면 돼요. 완성하면 링크
            하나로 바로 공개하고, 언제든 다시 편집할 수 있어요.
          </p>
        </div>
      </FadeIn>

      <div className="relative mt-16 sm:mt-28">
        <FadeIn delay={0.1} className="sm:ml-auto sm:w-[64%]">
          <figure>
            <div className="bg-muted relative aspect-[16/10] w-full overflow-hidden rounded-lg border shadow-sm">
              <Image
                src="/editor.webp"
                alt="블라누아 에디터 편집 화면"
                fill
                sizes="(max-width: 640px) 100vw, 640px"
                className="object-cover object-right dark:brightness-[0.85]"
              />
            </div>
            <figcaption className="text-muted-foreground mt-3 text-xs font-medium tracking-widest uppercase">
              Editor
            </figcaption>
          </figure>
        </FadeIn>

        <FadeIn className="mt-6 sm:absolute sm:top-[-2.5rem] sm:left-0 sm:z-10 sm:mt-0 sm:w-[52%]">
          <figure>
            <div className="bg-muted relative aspect-[16/10] w-full overflow-hidden rounded-lg border shadow-xl">
              <Image
                src="/live.webp"
                alt="블라누아로 만든 공개 페이지"
                fill
                sizes="(max-width: 640px) 100vw, 520px"
                className="object-cover dark:brightness-[0.85]"
              />
            </div>
            <figcaption className="text-muted-foreground mt-3 text-xs font-medium tracking-widest uppercase">
              Live Page
            </figcaption>
          </figure>
        </FadeIn>
      </div>
    </section>
  )
}

export default LandingAbout
