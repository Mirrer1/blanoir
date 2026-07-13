import { Loader2 } from 'lucide-react'

const EditLoading = () => {
  return (
    <div className="flex h-[100dvh] items-center justify-center">
      <Loader2 className="text-muted-foreground size-6 animate-spin" />
    </div>
  )
}

export default EditLoading
