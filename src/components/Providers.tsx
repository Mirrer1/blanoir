'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { useState } from 'react'
import { toast } from 'sonner'

// 서버 상태(React Query) + 테마(next-themes) 전역 Provider
const Providers = ({ children }: { children: React.ReactNode }) => {
  // 요청마다 새 QueryClient를 만들어 서버/클라이언트 간 캐시 공유 방지
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: 1, staleTime: 60_000 },
          mutations: { onError: () => toast.error('저장에 실패했어요') },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default Providers
