import ExploreHeader from './explore/_components/ExploreHeader'

const ExploreLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-[100dvh] flex-col">
      <ExploreHeader />
      <main className="flex-1 [scrollbar-gutter:stable] overflow-y-auto">{children}</main>
    </div>
  )
}

export default ExploreLayout
