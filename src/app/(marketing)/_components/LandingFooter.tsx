import Link from 'next/link'

const CONTACT_EMAIL = 'hansrndcorp@gmail.com'

const LINKS = [
  { label: '둘러보기', href: '/explore' },
  { label: '로그인', href: '/login' },
  { label: '회원가입', href: '/signup' },
]

const LandingFooter = () => {
  return (
    <footer className="relative flex min-h-[17rem] flex-col justify-center overflow-hidden border-t">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center select-none"
      >
        <span className="font-heading text-foreground/[0.06] text-[18vw] leading-none font-extrabold tracking-tighter">
          Blanoir
        </span>
      </div>

      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center gap-6 px-6 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex flex-col gap-1.5">
          <span className="font-heading text-base font-extrabold tracking-tight">
            Blanoir <span className="text-muted-foreground text-xs font-normal">블라누아</span>
          </span>
          <span className="text-muted-foreground text-xs">
            © {new Date().getFullYear()} Blanoir. All rights reserved.
          </span>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 sm:justify-start">
          {LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              {label}
            </Link>
          ))}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            문의하기
          </a>
        </nav>
      </div>
    </footer>
  )
}

export default LandingFooter
