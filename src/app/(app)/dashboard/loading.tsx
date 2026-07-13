const DashboardLoading = () => {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="bg-muted h-8 w-32 animate-pulse rounded" />
      <div className="mt-8 grid animate-pulse gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex flex-col gap-3 rounded-lg border p-4">
            <div className="bg-muted aspect-video w-full rounded" />
            <div className="flex items-center justify-between gap-2">
              <div className="bg-muted h-4 w-24 rounded" />
              <div className="bg-muted h-5 w-12 rounded-full" />
            </div>
            <div className="bg-muted h-3 w-20 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default DashboardLoading
