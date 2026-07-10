import { Toaster } from '@/components/ui/sonner'

const EditorLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <Toaster />
    </>
  )
}

export default EditorLayout
