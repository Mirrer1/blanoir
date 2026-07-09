const CONTACT_EMAIL = 'hansrndcorp@gmail.com'

const LandingFooter = () => {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 py-12 sm:grid sm:grid-cols-3">
        <span className="font-heading text-base font-extrabold tracking-tight sm:justify-self-start">
          Blanoir <span className="text-muted-foreground text-xs font-normal">블라누아</span>
        </span>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="text-muted-foreground hover:text-foreground text-sm sm:justify-self-center"
        >
          문의하기
        </a>
        <span className="text-muted-foreground text-sm sm:justify-self-end">
          © {new Date().getFullYear()} Blanoir. All rights reserved.
        </span>
      </div>
    </footer>
  )
}

export default LandingFooter
