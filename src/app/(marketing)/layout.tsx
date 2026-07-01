import LandingFooter from './_components/LandingFooter'
import LandingHeader from './_components/LandingHeader'

const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-[100dvh] flex-col">
      <LandingHeader />
      <main className="flex-1 [scrollbar-gutter:stable] overflow-y-auto">
        {children}
        <LandingFooter />
      </main>
    </div>
  )
}

export default MarketingLayout
