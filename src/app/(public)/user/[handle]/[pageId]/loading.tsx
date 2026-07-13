const PublicPageLoading = () => {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex animate-pulse flex-col gap-6">
        <div className="bg-muted h-10 w-2/3 rounded" />
        <div className="bg-muted aspect-video w-full rounded-xl" />
        <div className="flex flex-col gap-3">
          <div className="bg-muted h-4 w-full rounded" />
          <div className="bg-muted h-4 w-5/6 rounded" />
          <div className="bg-muted h-4 w-3/4 rounded" />
        </div>
      </div>
    </div>
  )
}

export default PublicPageLoading
