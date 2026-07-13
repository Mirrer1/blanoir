const ExploreDetailLoading = () => {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex animate-pulse flex-col gap-8 sm:gap-12">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-4">
            <div className="bg-muted h-4 w-16 rounded" />
            <div className="bg-muted h-8 w-2/3 rounded" />
          </div>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="bg-muted size-12 rounded-full sm:size-14" />
              <div className="bg-muted h-4 w-24 rounded" />
            </div>
            <div className="bg-muted h-9 w-20 rounded-md" />
          </div>
        </div>

        <div className="bg-muted aspect-video w-full rounded-xl" />

        <div className="flex flex-col gap-3">
          <div className="bg-muted h-4 w-full rounded" />
          <div className="bg-muted h-4 w-11/12 rounded" />
          <div className="bg-muted h-4 w-3/4 rounded" />
        </div>
      </div>
    </div>
  )
}

export default ExploreDetailLoading
