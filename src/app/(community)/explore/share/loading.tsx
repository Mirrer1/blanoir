const ExploreShareLoading = () => {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="bg-muted h-8 w-28 animate-pulse rounded" />
      <div className="mt-8 flex animate-pulse flex-col gap-6">
        <div className="bg-muted h-11 w-full rounded-md" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-muted h-8 w-20 rounded-full" />
          ))}
        </div>
        <div className="bg-muted aspect-video w-full max-w-md rounded-xl" />
        <div className="bg-muted h-64 w-full rounded-lg" />
      </div>
    </div>
  )
}

export default ExploreShareLoading
