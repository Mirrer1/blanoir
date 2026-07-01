import ExploreHeader from './explore/_components/ExploreHeader'

const ExploreLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ExploreHeader />
      <main className="flex-1">{children}</main>
    </>
  )
}

export default ExploreLayout
