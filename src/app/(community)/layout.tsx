import ExploreHeader from './explore/_components/ExploreHeader'
import ScrollReset from '@/components/common/ScrollReset'

const ExploreLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-[100dvh] flex-col">
      <ExploreHeader />
      <main id="explore-main" className="flex-1 [scrollbar-gutter:stable] overflow-y-auto">
        {children}
      </main>
      <ScrollReset targetId="explore-main" />
    </div>
  )
}

export default ExploreLayout
