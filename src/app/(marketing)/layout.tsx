import LandingFooter from './_components/LandingFooter'
import LandingHeader from './_components/LandingHeader'

const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex h-[100dvh] flex-col">
      <LandingHeader />
      <main className="bg-muted/30 hide-scrollbar flex-1 overflow-y-auto">
        {children}
        <LandingFooter />
      </main>
    </div>
  )
}

export default MarketingLayout
