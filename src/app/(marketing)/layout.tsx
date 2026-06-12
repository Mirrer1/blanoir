import LandingFooter from './_components/LandingFooter'
import LandingHeader from './_components/LandingHeader'

const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <LandingHeader />
      <main className="flex-1">{children}</main>
      <LandingFooter />
    </>
  )
}

export default MarketingLayout
