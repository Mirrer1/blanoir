import { Toaster } from '@/components/ui/sonner'

const EditorLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <link rel="preconnect" href="https://res.cloudinary.com" />
      {children}
      <Toaster />
    </>
  )
}

export default EditorLayout
