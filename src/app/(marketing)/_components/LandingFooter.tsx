import Link from 'next/link'

const LandingFooter = () => {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 py-12 sm:flex-row">
        <span className="font-heading text-base font-extrabold tracking-tight">Blanoir</span>
        <nav className="text-muted-foreground flex items-center gap-6 text-sm">
          <Link href="/login" className="hover:text-foreground">
            로그인
          </Link>
          <Link href="/signup" className="hover:text-foreground">
            시작하기
          </Link>
        </nav>
        <span className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} Blanoir. All rights reserved.
        </span>
      </div>
    </footer>
  )
}

export default LandingFooter
