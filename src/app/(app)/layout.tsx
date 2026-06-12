import AppHeader from './_components/AppHeader'

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AppHeader />
      <main className="flex-1">{children}</main>
    </>
  )
}

export default AppLayout
