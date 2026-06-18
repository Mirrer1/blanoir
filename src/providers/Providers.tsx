'use client'

import { ThemeProvider } from 'next-themes'

// 전역 Provider
const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      {children}
    </ThemeProvider>
  )
}

export default Providers
