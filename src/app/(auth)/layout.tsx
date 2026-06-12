import Link from 'next/link'

import ThemeToggle from '@/components/common/ThemeToggle'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center px-6 py-12">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Link href="/" className="font-heading mb-8 text-2xl font-extrabold tracking-tight">
        Blanoir
      </Link>
      {children}
    </div>
  )
}

export default AuthLayout
